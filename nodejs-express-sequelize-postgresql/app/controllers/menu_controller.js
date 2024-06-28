const { range } = require("rxjs");
const pool = require("../config/db.config");
const poolGapo = require("../config/db.configpgGpao");

// Add Menu
const getMenu = (req, res, next) => {
    const accessibilite = req.body.accessibilite;
    pool.query(
      "select id_menu,  nom_menu,  route_menu,  rang_menu::INTEGER,  icon_menu,  sous_menu,  accessibilite from menu where accessibilite between 1 and $1 order by rang_menu asc",
      [accessibilite],
      function (err, result) {
        if (err) {
          res.status(400).send(err);
        }
        if (Object.keys(result).length > 0) {
          res.status(200).send(result.rows);
        } else {
          res.status(200).send();
        }
      }
    );
  };

// Add Menu
const getDateNow = (req, res, next) => {     
    pool.query("select now()", [], function (err, result) {
       if (err) {
        res.status(400).send(err);
    }
    if (Object.keys(result).length > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(200).send();
    }
});
};

// Get Max Rank Menu
const getMaxRangMenu = (req, res, next) => {     
    pool.query("select max(rang_menu) from public.menu", [], function (err, result) {
       if (err) {
        res.status(400).send(err);
    }
    if (Object.keys(result).length > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(200).send();
    }
});
};

// Insert Menu
const insertMenu = (req, res, next) => {
    const nom_menu = req.body.nom_menu;
    const route_menu = req.body.route_menu;
  
    const icon_menu = req.body.icon_menu;
    const accessibilite = req.body.accessibilite;
  
    pool.query(
      "select (max(rang_menu::INTEGER) + 1) as max from menu",
      [],
      function (err, result) {
        if (err) {
          res.status(400).send(err);
        }
        if (Object.keys(result).length > 0) {
          console.log(result);
          const rang_menu = result.rows[0].max
  
          pool.query(
            "insert into menu (nom_menu, route_menu, rang_menu, icon_menu, sous_menu, accessibilite) values ($1,$2,$3,$4,$5,$6)",
            [nom_menu, route_menu, rang_menu, icon_menu, "[]", accessibilite],
            function (err, result) {
              if (err) {
                res.status(400).send(err);
              }
              if (Object.keys(result).length > 0) {
                res.status(200).send(result.rows);
              } else {
                res.status(200).send();
              }
            }
          );
        } 
      }
    );
}

// Update Menu
const updateMenu = (req, res, next) => { 
    const id_menu = req.body.id_menu
    const nom_menu = req.body.nom_menu
    const route_menu = req.body.route_menu
    const rang_menu = req.body.rang_menu    
    const icon_menu = req.body.icon_menu 
    const accessibilite = req.body.accessibilite   
    pool.query("update public.menu set nom_menu = $1, route_menu = $2, rang_menu = $3, icon_menu = $4, accessibilite = $6 where id_menu = $5", [nom_menu, route_menu, rang_menu, icon_menu, id_menu, accessibilite], function (err, result) {
       if (err) {
        res.status(400).send(err);
    }
    if (Object.keys(result).length > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(200).send();
    }
});
};

// Delete Menu
const supprimerMenu = (req, res, next) => { 
    const id_menu = req.body.id_menu   
    pool.query("delete from public.menu where id_menu = $1", [id_menu], function (err, result) {
       if (err) {
        res.status(400).send(err);
    }
    if (Object.keys(result).length > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(200).send();
    }
});
};

// Login
const getLogin = (req, res, next) => {  
    const matricule = req.body.matricule
    const password = req.body.password   
    pool.query("select count(*) from public.utilisateur where matricule = $1 and password_user = $2", [matricule, password], function (err, result) {
       if (err) {
        res.status(400).send(err);
    }
    if (Object.keys(result).length > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(200).send();
    }
    });
};

// Update Rang Menu
const updateRangMenu = (req, res, next) => {  
    const range = req.body.range
    const id_menu = req.body.id_menu
    pool.query("update public.menu set rang_menu = $1 where id_menu = $2", [range,id_menu], function (err, result) {
        if (err) {
            res.status(400).send(err);
        }
        if (Object.keys(result).length > 0) {
            res.status(200).send(result.rows);
        } else {
            res.status(200).send();
        }
    });
};

// Update Rang Menu
const updateSousMenu = (req, res, next) => {  
    const id_menu = req.body.id_menu
    const restSousMenu = req.body.restSousMenu
    pool.query("update public.menu set sous_menu = $1 where id_menu = $2", [restSousMenu,id_menu], function (err, result) {
        if (err) {
            res.status(400).send(err);
        }
        if (Object.keys(result).length > 0) {
            res.status(200).send(result.rows);
        } else {
            res.status(200).send();
        }
    });
};

// Titre
const getTitre = (req, res, next) => {  
    pool.query("select * from public.titre", [], function (err, result) {
       if (err) {
        res.status(400).send(err);
    }
    if (Object.keys(result).length > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(200).send();
    }
});
};

// Update Rang Menu
const updateTitre = (req, res, next) => {  
    const titreLogin = req.body.titreLogin
    const titreMenuMax = req.body.titreMenuMax
    const titreMenuMin = req.body.titreMenuMin
    pool.query("update public.titre set \"titreLogin\" = $1, \"titreMenuMax\" = $2, \"titreMenuMin\" = $3", [titreLogin,titreMenuMax,titreMenuMin], function (err, result) {
        if (err) {
            res.status(400).send(err);
        }
        if (Object.keys(result).length > 0) {
            res.status(200).send(result.rows);
        } else {
            res.status(200).send();
        }
    });
};

// Login from gpao
const getLoginFromGpao = (req, res, next) => {  
    const matricule = req.body.matricule
    const password = req.body.password   
    poolGapo.query("select * from operateur where matricule = $1 and passwd = $2", [matricule, password], function (err, result) {
       if (err) {
        res.status(400).send(err);
    }
    if (Object.keys(result).length > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(200).send();
    }
    });
};

module.exports = {getMenu, getDateNow, getLogin, getMaxRangMenu, updateMenu, updateRangMenu, supprimerMenu, insertMenu,updateSousMenu, getTitre, updateTitre, getLoginFromGpao};