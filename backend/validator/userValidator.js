const {z} = require('zod')

const userSchema = z.object({
  name: z.string().min(1,{message: 'Name is required'}),
  email: z.string().email('Invalid email format').min(1,{message: 'Email is required'}),
  password: z.string().min(6,{message: 'Password must be at least 6 characters'}),
  role: z.enum(['portManager', 'shipOwner']),
});

module.exports=userSchema;