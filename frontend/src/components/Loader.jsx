import React from 'react'
import loading from "../assets/loading.json"
import Lottie from 'lottie-react'

const Loader = () => {
    return (
        <Lottie
            options={{ animationData: loading, loop: true, autoplay: true }}
        />
    )
}

export default Loader