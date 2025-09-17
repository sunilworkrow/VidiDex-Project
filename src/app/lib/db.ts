import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: 'localhost',      
  user: 'root',           
  password: '',           
  database: 'video_url_listing', 
});


export default db;