import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setPortinfo } from '../redux/portSlice'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const P_PortRegister = ({ open, setOpen }) => {
    const dispatch = useDispatch();
    const { portinfo } = useSelector(store => store.port);

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
        portId: "",
        max_berth: '',
        timeTakenPerContent: {
            food: 0,
            material: 0
        },
        cost_per_time: '',
        country: ''
    });

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/v1/port/port_register", input, {
                headers: {
                    "Content-Type": "application/json"
                }, withCredentials: true
            })
            if (res.data.success) {
                const updatedPortInfo = [...portinfo];
                updatedPortInfo.push(res.data.port);
                dispatch(setPortinfo(updatedPortInfo))
                setOpen(false);
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error);
        }
    };

    const onChangeHandler = (e) => {
        setInput({ ...input, [e.target.id]: e.target.value });
    };
    const handleCountryChange = (value) => {
        setInput({ ...input, country: value });
    };
    const onNestedChangeHandler = (e) => {
        const { id, value } = e.target;
        setInput(prev => ({
            ...prev,
            timeTakenPerContent: { ...prev.timeTakenPerContent, [id]: value }
        }));
    };

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <Card>
                        <CardHeader>
                            <CardTitle>Register Port</CardTitle>
                            <CardDescription>Enter port details below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onSubmitHandler}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="portId">Port ID</Label>
                                        <Input id="portId" placeholder="Port ID" onChange={onChangeHandler} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="max_berth">Maximum Berths</Label>
                                        <Input id="max_berth" placeholder="Max berths available" onChange={onChangeHandler} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="food">Time per Food Content</Label>
                                        <Input id="food" placeholder="Time (hours)" onChange={onNestedChangeHandler} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="material">Time per Material Content</Label>
                                        <Input id="material" placeholder="Time (hours)" onChange={onNestedChangeHandler} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="cost_per_time">Cost per Time</Label>
                                        <Input id="cost_per_time" placeholder="Cost per hour" onChange={onChangeHandler} />
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

export default P_PortRegister;
