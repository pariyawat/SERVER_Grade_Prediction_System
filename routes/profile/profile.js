const express = require('express')
const router = express.Router();
const Profile = require('../../service/profile/profile');
router.get('/:id/:role',(req,res)=>{
    let dataId = req.params.id 
    let dataRole = req.params.role
    Profile.getProfile(dataId,dataRole, (err, row) => {
        if (err) {
            res.json(err);
        } else  {
            res.json(row);
        }
    });

});
module.exports = router;