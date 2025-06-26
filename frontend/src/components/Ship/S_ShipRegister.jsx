import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setShipinfo } from '../redux/shipSlice'

const S_ShipRegister = ({ open, setOpen }) => {
    const dispatch = useDispatch();
    const { shipinfo } = useSelector(store => store.ship)
    // State to hold the list of countries
    const [countries, setCountries] = useState([]);

    // Fetch countries when the component mounts
    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all?fields=name')
            .then(response => {
                const countryList = response.data;
                countryList.sort((a, b) => a.name.common.localeCompare(b.name.common));
                setCountries(countryList);
            })
            .catch(error => {
                console.error("Error fetching countries:", error);
            });
    }, []);  // Empty array ensures this runs only once, when the component mounts

    const [input, setInput] = useState({
        shipName: "",
        shipType: '',
        shipReg: '',
        country: ''
    });

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/v1/ship/ship_register", input, {
                headers: {
                    "Content-Type": "application/json"
                }, withCredentials: true
            })
            if (res.data.success) {
                const updatedShipInfo = [...shipinfo];
                updatedShipInfo.push(res.data.ship);
                dispatch(setShipinfo(updatedShipInfo))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }

    };

    const onChangeHandler = (e) => {
        setInput({ ...input, [e.target.id]: e.target.value });
    };

    const handleCountryChange = (value) => {
        setInput({ ...input, country: value });
    };
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <Card>
                        <CardHeader>
                            <CardTitle>Register Ship</CardTitle>
                            <CardDescription>Enter ship details below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onSubmitHandler}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="shipName">Name</Label>
                                        <Input id="shipName" placeholder="Name of your ship" onChange={onChangeHandler} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="shipType">Type</Label>
                                        <Input id="shipType" placeholder="Type of your ship" onChange={onChangeHandler} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="shipReg">Register No</Label>
                                        <Input id="shipReg" placeholder="Ship registration number" onChange={onChangeHandler} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="country">Country</Label>
                                        <Select onValueChange={handleCountryChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                {
                                                    countries?.map((country) => (
                                                        <SelectItem key={country.cca3} value={country.name.common}>{country.name.common}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Button type='submit'>Register</Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default S_ShipRegister;
