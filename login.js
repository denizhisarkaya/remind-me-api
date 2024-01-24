// pages/signup.js

// import { useState } from 'react';

// const Signup = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Veritabanına kaydetme işlemleri burada gerçekleştirilecek
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         Kullanıcı Adı:
//         <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//       </label>
//       <br />
//       <label>
//         E-posta:
//         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//       </label>
//       <br />
//       <label>
//         Şifre:
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       </label>
//       <br />
//       <button type="submit">Kayıt Ol</button>
//     </form>
//   );
// };

// export default Signup;


// // pages/signup.js

// const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const data = { username, email, password };
  
//     try {
//       const response = await fetch('http://localhost:8000', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });
  
//       if (response.ok) {
//         console.log('Kayıt başarılı!');
//       } else {
//         console.error('Kayıt sırasında bir hata oluştu.');
//       }
//     } catch (error) {
//       console.error('Sunucu ile iletişim sırasında bir hata oluştu:', error);
//     }
//   };

  
// // POST isteğine cevap veren bir endpoint
// app.post('/', (req, res) => {
//     console.log(req.body); // Gelen JSON verisini log'a yazdırıyoruz.
//     res.send(req.body); // Gelen JSON verisini geri gönderiyoruz.
// });