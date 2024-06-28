const pool = require("../config/db.config");
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const generateExcel = async (req, res) => {
    try {
        const templatePath = path.join(__dirname, 'assets', 'BCQ_PRODIGY_20240612_110547_2.xlsx');
        console.log('Template path:', templatePath);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);
        const worksheet = workbook.worksheets[0];
        const resultat = req.body;
        // Inserting data into the Excel template
        worksheet.getCell('C6').value = resultat.nom_livrable || '';
        worksheet.getCell('C7').value = resultat.nb_lot || '';
        worksheet.getCell('C8').value = resultat.nb_acte || '';
        worksheet.getCell('C9').value = resultat.date_controle || '';
        worksheet.getCell('C10').value = resultat.date_debut || '';
        worksheet.getCell('C11').value = resultat.date_fin || '';
        worksheet.getCell('C12').value = resultat.matricule_controleur || '';

        worksheet.getCell('D16').value = resultat.decision_validite || '';
        worksheet.getCell('D17').value = resultat.decision_structure || '';
        worksheet.getCell('D18').value = resultat.decision_exhaustivite || '';

        worksheet.getCell('E16').value = resultat.commentaire_validite || '';
        worksheet.getCell('E17').value = resultat.commentaire_structure || '';
        worksheet.getCell('E18').value = resultat.commentaire_exhaustivite || '';
        worksheet.getCell('C25').value = resultat.taille_echantillon || '';
        worksheet.getCell('C27').value = resultat.nom_control || '';
        worksheet.getCell('C29').value = resultat.seuil_acceptation || '';
        worksheet.getCell('C30').value = (resultat.seuil_acceptation + 1) || '';

        worksheet.getCell('F23').value = resultat.controle_exhaustivite || '';
        worksheet.getCell('F24').value = resultat.controle_echantillonne || '';
        worksheet.getCell('F26').value = resultat.nbr_unite_non_conforme || '';

        let rowIndex = 36;
        let columnIndex = 'C';
        for (const item of resultat.echantillonError) {
            for (let i = 0; i < item.echantillon.length; i++) {
                const it = item.echantillon[i];
                worksheet.getCell(`${columnIndex}${rowIndex + i}`).value = it.nom_fichier;
                worksheet.getCell(`${columnIndex}${rowIndex + i + 1}`).value = it.nom_image;
                worksheet.getCell(`${columnIndex}${rowIndex + i + 2}`).value = it.nom_typage;
                worksheet.getCell(`${columnIndex}${rowIndex + i + 3}`).value = item.unite_non_conforme;
                worksheet.getCell(`${columnIndex}${rowIndex + i + 4}`).value = item.nbr_faute;
                if (item.liste_faute !== 'vide') {
                    const formattedListeFaute = Array.isArray(item.liste_faute) ? item.liste_faute.filter(f => f !== "").join(", ") : item.liste_faute;
                    worksheet.getCell(`${columnIndex}${rowIndex + i + 5}`).value = formattedListeFaute;
                } else {
                    worksheet.getCell(`${columnIndex}${rowIndex + i + 5}`).value = '';
                }
            }
            columnIndex = String.fromCharCode(columnIndex.charCodeAt(0) + 1);
        }        

        // Prepare the file to be sent back
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="bordereaux-cq.xlsx"');
        res.send(buffer);
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).send('An error occurred while generating the Excel file');
    }
};

// Get Current Date and Time
const getTypecontrole = (req, res, next) => {     
    pool.query("SELECT * FROM prodigy_new.type_controle ORDER BY id_type_controle ASC", [], function (err, result) {
       if (err) {
        res.status(400).send(err);
        } 
        else {
            res.status(200).send(result.rows);
        }
});
};

const getLivraison = (req, res, next) => {
    const { date_debut, date_fin } = req.body;
    const select = "SELECT l.*, (SELECT COUNT(DISTINCT id_image) FROM prodigy_new.non_conforme nc WHERE NULLIF(nc.id_livrable, '')::integer = l.id_livrable) AS nb_acte_nc FROM prodigy_new.livrable l WHERE id_livrable IS NOT NULL and (id_reprise is null or id_reprise = '') ";
    const order = " ORDER BY l.date_controle ASC";
    let where = " ";
    if (date_debut && date_fin) {
        where += ` AND l.date_controle::date BETWEEN '${date_debut}' AND '${date_fin}'`;
    }
    const sql = select + where + order;
    pool.query(sql, [], (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }
        if (result && result.rows && result.rows.length > 0) {
            return res.status(200).send(result.rows);
        } else {
            return res.status(200).send({ message: "No data found" });
        }
    });
};

const CountList = (req,res,next) =>{
    pool.query("",[],function(err,result){
        
    })
}

const getTypeActe = (req, res, next) => {     
    pool.query("SELECT * FROM prodigy_new.typage ORDER BY num_typage ASC", [], function (err, result) {
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

const getReprise = (req,res) => {
    const id_livrable = req.body.id_livrable;
    pool.query("SELECT * FROM prodigy_new.livrable WHERE (decision != 'V' OR decision IS NULL) AND (id_reprise IS NOT NULL AND id_reprise != '') AND id_reprise = (SELECT id_reprise::varchar FROM prodigy_new.reprise WHERE id_livrable = $1)", [id_livrable], function (err, result) {
    if (err) {
        res.status(400).send(err);
        } 
    else {
        res.status(200).send(result.rows);
        }
    })
}

const getEchantillon = (req, res) => {
    const { id_livrable } = req.body.data;
    pool.query("SELECT echantillon FROM prodigy_new.livrable WHERE id_livrable = $1", [id_livrable], (err, result) => {
        if (err) {return res.status(400).send(err);}
        const echantillon = result.rows.length > 0 ? result.rows[0].echantillon : undefined;
        if (!echantillon) {return res.status(404).send('No echantillon found');}
        const ids = echantillon.split('|').map(id => parseInt(id)).filter(id => !isNaN(id));
        if (ids.length === 0) {return res.status(404).send('No valid IDs found in echantillon');}
        const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
        const query = `SELECT DISTINCT i.id_image, i.nom_image, f.nom_fichier, i.num_typage1, i.id_fichier, i.id_image FROM prodigy_new.image i JOIN prodigy_new.fichier f ON i.id_fichier = f.id_fichier WHERE i.id_image IN (${placeholders}) ORDER BY i.nom_image`;
        pool.query(query, ids, (err, result) => {
            if (err) {return res.status(400).send(err);}
            const resultat = result.rows;
            if (resultat.length === 0) {return res.status(404).send('No resultat found');}
            const finalResult = [];
            let completedRequests = 0;
            resultat.forEach(item => {
                const imageId = item.id_image;
                const errorQuery = `SELECT e.type_erreur, n.id_faute FROM prodigy_new.non_conforme n JOIN prodigy_new.erreur e ON e.id_erreur::varchar = n.id_faute WHERE n.id_image = $1 AND n.id_livrable = $2`;
                pool.query(errorQuery, [imageId, id_livrable], (err, errorResult) => {
                    if (err) {
                        finalResult.push({ echantillon: [item], errors: [] });
                    } else {
                        finalResult.push({ echantillon: [item], errors: errorResult.rows });
                    }
                    completedRequests++;
                    if (completedRequests === resultat.length) {
                        res.status(200).send(finalResult);
                    }
                });
            });
        });
    });
}

module.exports = {getTypecontrole,getLivraison,getTypeActe, getReprise, getEchantillon, generateExcel};