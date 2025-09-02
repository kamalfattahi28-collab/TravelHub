const express= require('express');
const mysql=require('mysql2')
const crypto=require('crypto')

const router=express.Router();


const db = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password: '',
    database : 'magellansaudi'
});

//Create password reset request

router.post('/',(req,res)=>{
    const {email} = req.body;
    const reset_token = crypto.randomBytes(32).toString('hex');
    const reset_expiration = new Date(Date.now() + 1000 * 60 * 15); // 15 minute
    
    db.execute('SELECT email FROM tourists WHERE email = ?',[email],(err,result)=>{
        if(err) return res.status(500).send(err);
        if(result.length === 0) return res.status(404).send('Email not found')

            db.execute('INSERT INTO password_resets (email ,reset_token,reset_expiration ) VALUES (?,?,?)',[email,reset_token,reset_expiration],(err,result)=>{
                if(err) return res.status(500).send(err)
                    res.status(201).json({reset_token, expires_at:reset_expiration})
            });
    });

});

//verify reset token
 router.get('/:token',(req,res)=>{
    const {token} = req.params
    const now=new Date();

    db.execute('SELECT * FROM password_resets WHERE reset_token=? AND reset_expiration > ? ',[token,now],(err,result)=>{
        if (err) return res.status(500).send(err)
            if(result.length===0) return res.status(404).send('invaild or expired token')
                res.json({email: result[0].email})
    });
 });

 //Delete reset token (after successful reset)
 router.delete('/:token',(req,res)=>{
        const {token}=req.params;
    db.execute('DELETE FROM password_resets WHERE reset_token=? ',[token],(err,result)=>{
        if(err) return res.status(500).send(err);
        res.send('Token Deleted');
    });
});

module.exports = router;
