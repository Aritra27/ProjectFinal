const  otpTemplate=(otp, name)=> {
    return `
        <div style="font-family: Arial, sans-serif;">
            <h2>Hello ${name || 'User'},</h2>
            <p>Your OTP for CargoConnect signup is:</p>
            <h1>${otp}</h1>
            <p>This OTP is valid for 5 minutes.</p>
        </div>
    `;
};
 module.exports = otpTemplate
