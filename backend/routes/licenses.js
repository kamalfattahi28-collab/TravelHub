const express=require('express');
const mysql=require('mysql2');
const router=express.Router();
const authMiddleware = require('../middleware/auth');

const db=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database : 'magellansaudi'
});
//Create license

router.post('/',(req,res)=>{
    const{ guide_id, issue_date,expiry_date,issued_by, license_file }=req.body

    const sql='INSERT INTO licenses (guide_id, issue_date,expiry_date,issued_by, license_file,  is_valid ) VALUES (?,?,?,?,?,0) '
    db.execute(sql,[ guide_id, issue_date,expiry_date,issued_by, license_file],(err,result)=>{
        if(err) return res.status(500).send(err)
        res.status(201).json({license_id: result.insertId,guide_id, issue_date,expiry_date,issued_by, license_file,is_valid})
    });
});

//get all license

router.get('/',authMiddleware,(req,res)=>{
    db.execute('SELECT * FROM licenses',(err,result)=>{
        if(err) return res.status(500).send(err);
        res.json(result);
    });
});

//get license by ID

router.get('/:id',authMiddleware,(req,res)=>{
    const {id}=req.params;

    db.execute('SELECT * FROM licenses WHERE  license_id=?',[id],(err,result)=>{
        if(err) return res.status(500).send(err)
        if(result.length===0) return res.status(404).send('Not dound');
        res.json(result[0]);
    });
});

// Update license

router.put('/:id',authMiddleware,(req,res)=>{
    const {id} =req.params;
    const {guide_id, issue_date,expiry_date,issued_by, license_file}=req.body;

    const sql='UPDATE licenses SET  guide_id=? issue_date=?,expiry_date=?,issued_by=?, license_file=? , WHERE license_id=? '
    db.execute(sql,[guide_id, issue_date,expiry_date,issued_by, license_file,id],(err,result)=>{
        if (err) return res.status(500).send(err);
                if (result.affectedRows === 0) return res.status(404).send('Not found');
                res.json({ id, guide_id, issue_date,expiry_date,issued_by, license_file });
    });
});

// verify license

router.put('/licensesver/:id',authMiddleware,(req,res)=>{
    const {id}=req.params;
    const {state}=req.body;
    const valid = state === true || state === 1 ? 1 : 0 
    db.execute('UPDATE licenses SET  is_valid=? WHERE license_id=?  ',[valid,id],(err,result)=>{
        if(err) return res.status(500).send(err)
        if(result.affectedRows === 0) return res.status(404).send('license not found')
            res.json({id ,is_valid:valid})
    })
})
//Delete license

router.delete('/:id',authMiddleware,(req,res)=>{
    const {id}=req.params;
    db.execute('DELETE FROM licenses WHERE  license_id=? ',[id],(err,result)=>{
        if(err) return res.status(500).send(err);
        if (result.effectsRows===0) return res.status(404).send('Not found');
        res.send('Deleted');
    });
});

module.exports = router;