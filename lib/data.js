import bcrypt from 'bcryptjs';
const data = {

  users: [
    {
      name: 'cedo',
      email: 'cedo@gmail.com',
      role: "admin",
      password: bcrypt.hashSync('12345678'),  
      isAdmin: true,

    },
  
  ],
};
export default data;