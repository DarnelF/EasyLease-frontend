import React from "react";
import style from "../styles/Contrat.module.css";
import Navbar from "./Navbar";
import { useState, useEffect, useRef } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
const { ObjectId } = require("mongoose").Types;

function Contrat() {
  const BACKEND_ADDRESS = "http://localhost:3000";
  const ContratReducer = useSelector((state) => state.contrat.value);
  const [dataInterlocutor, setDataInterlocutor] = useState([]);

  const [interlocName, setInterlocName] = useState("");
  const [phoneNumber, setPhoneNumer] = useState("");
  const [interlocFirstName, setInterlocFirstname] = useState("");
  const [interlocMail, setInterlocMail] = useState("");
  const [interlocJob, setInterlocJob] = useState("");
  const [showModalInterlocutor, setShowModalInterlocutor] = useState(false);
  const [modalModifierSuccess, setModalModifierSuccess] = useState(false);
  const [modalModifierFailed, setModalModifierFailed] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showModalDoc, setShowModalDoc] = useState(false);

  console.log("ContratReducer", ContratReducer);
  console.log("dataInterlocutor", dataInterlocutor);

  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/interlocutor/${ContratReducer.interlocutor}`)
      .then((res) => res.json())
      .then((data) => {
        setDataInterlocutor([data.contrat]);
      });
  }, []);

  const contratData = [ContratReducer].map((item, i) => {
    const contratStart = new Date(item.contratStart);
    const contratStartFormattedDate = contratStart.toLocaleDateString();
    const contratEnd = new Date(item.contratEnd);
    const contratEndFormattedDate = contratEnd.toLocaleDateString();
    return (
      <div className={style.data} key={i}>
        <span className={style.texte}>
          Type d'équipements financés : {item.type}
        </span>
        <span className={style.texte}>Montant financé : {item.amount} €</span>
        <span className={style.texte}>Marge : {item.marge} %</span>
        <span className={style.texte}>
          Durée contractuelle : {item.duration} mois
        </span>
        <span className={style.texte}>
          Date de démarrage : {contratStartFormattedDate}
        </span>
        <span className={style.texte}>
          Date de fin : {contratEndFormattedDate}
        </span>
        <span className={style.texte}>
          Valeur résiduelle : {item.residualValue} %
        </span>
      </div>
    );
  });

  const interlocutorData = dataInterlocutor.map((item, i) => {
    return (
      <div className={style.data} key={i}>
        <span className={style.texte}>Nom : {item.name}</span>
        <span className={style.texte}>Prénom : {item.firstname}</span>
        <span className={style.texte}>Poste : {item.poste}</span>
        <span className={style.texte}>Téléphone : {item.tel}</span>
        <span className={style.texte}>Mail : {item.email}</span>
      </div>
    );
  });
  const objectIdArray = [new ObjectId("1234567890abcdef12345678")];

  [new ObjectId(ContratReducer.client)];

  const saveInterlocutor = () => {
    fetch(`${BACKEND_ADDRESS}/interlocutor/addInterlocuteur`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: interlocName,
        firstname: interlocFirstName,
        poste: interlocJob,
        phone: phoneNumber,
        email: interlocMail,
        client: objectIdArray,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("INTERLOCUTEUR AJOUTÉ EN DB INTERLOCUTEUR =>", data);
        if (data.result) {
          setDataInterlocutor([data.newInterlocutor]);
          setInterlocName("");
          setPhoneNumer("");
          setInterlocFirstname("");
          setInterlocMail("");
          setInterlocJob("");
          setShowModalInterlocutor(false);
        } else {
          console.log("post new interlocutor failed");
        }
      });
    // fetch(`${BACKEND_ADDRESS}/contrat/update/${ContratReducer._id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     client: ContratReducer.client,
    //     name: ContratReducer.name,
    //     interlocutor: dataInterlocutor._id,
    //     type: ContratReducer.type,
    //     duration: ContratReducer.durée,
    //     amount: ContratReducer.montant,
    //     creationDate: ContratReducer.creationDate,
    //     contratStart: ContratReducer.date_de_début,
    //     contratEnd: ContratReducer.date_de_fin,
    //     residualValue: ContratReducer.valeur_résiduel,
    //     links: "TEST",
    //     marge: ContratReducer.marge,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data.result) {
    //       // setModalModifierSuccess(true);
    //       console.log("CONTRAT MODIFIÉ AVEC NOUVEL INTERLOCUTEUR =>", data);
    //     } else {
    //       console.log("DATA PUT=>", data);
    //       // setModalModifierFailed(true);
    //     }
    //   });
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    // requete POST qui doit enregistrer le PDF dans la DB du contrat du client
    // fetch(`${BACKEND_ADDRESS}/`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ document: document }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     data.result;
    //   });
  };

  const handleCloseModal = () => {
    setShowModalDoc(false);
    setShowModalInterlocutor(false);
    setModalModifierFailed(false);
    setModalModifierSuccess(false);
  };

  return (
    <>
      <div className={style.mainContent}>
        <Navbar />
        <div className={style.header}>
          <h1 className={style.head}>Contrat : {ContratReducer.name} </h1>
        </div>
        <div className={style.container}>
          <div className={style.SousContainerLeft}>
            <div className={style.boxData + " " + style.boxData1}>
              <span className={style.titreBoxData}>
                Informations du contrat :
              </span>
              <div className={style.contenuBoxData}>{contratData}</div>
            </div>
            <div className={style.boxData + " " + style.boxData}>
              <span className={style.titreBoxData}>
                Interlocutor du contrat :
              </span>
              <div className={style.contenuBoxData}>{interlocutorData}</div>
            </div>
            <div className={style.boxData + " " + style.boxData3}>
              <div className={style.contenuBoxData}>
                <button
                  className={style.button}
                  onClick={() => setShowModalInterlocutor(true)}
                >
                  Modifier l'interlocutor
                </button>
              </div>
            </div>
          </div>
          <div className={style.SousContainerRight}>
            <div className={style.boxData + " " + style.boxData4}>
              <div className={style.contenuBoxData}>
                <button className={style.button}>Modifier</button>

                <button className={style.button}>Supprimer</button>
              </div>
            </div>

            <div className={style.boxData + " " + style.boxData5}>
              <span className={style.titreBoxData}>Documents joints : </span>
              <div className={style.contenuBoxData}>
                <img
                  src="/faux-contrat.webp"
                  alt="Image contrat"
                  width="200px"
                  height="200px"
                />
              </div>

              {/* <iframe
                src={`${testPdf}#view=fitH`}
                title="testPdf"
                height="100%"
                width="100%"
              /> */}
            </div>

            <div className={style.boxData + " " + style.boxData6}>
              <div className={style.contenuBoxData}>
                <div>
                  <button
                    onClick={() => setShowModalDoc(true)}
                    className={style.button}
                  >
                    Ajouter un document
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Modal
            onCancel={() => handleCloseModal()}
            open={showModalInterlocutor}
            footer={null}
          >
            <span>Nouvel Interlocutor du contrat : </span>
            <div className={style.newInterlocutorContainer}>
              <br />
              <div className={style.InputNewInterlocutorContainer}>
                <input
                  className={style.inputNewInterlocutor}
                  placeholder="Nom"
                  type="text"
                  onChange={(e) => setInterlocName(e.target.value)}
                  value={interlocName}
                ></input>
                <br />
                <input
                  className={style.inputNewInterlocutor}
                  placeholder="Prénom"
                  type="text"
                  onChange={(e) => setInterlocFirstname(e.target.value)}
                  value={interlocFirstName}
                ></input>
                <br />
                <input
                  className={style.inputNewInterlocutor}
                  placeholder="Poste"
                  type="text"
                  onChange={(e) => setInterlocJob(e.target.value)}
                  value={interlocJob}
                ></input>
                <br />
                <input
                  className={style.inputNewInterlocutor}
                  placeholder="Numéro de téléphone"
                  type="text"
                  onChange={(e) => setPhoneNumer(e.target.value)}
                  value={phoneNumber}
                ></input>
                <br />
                <input
                  className={style.inputNewInterlocutor}
                  placeholder="Email"
                  type="text"
                  onChange={(e) => setInterlocMail(e.target.value)}
                  value={interlocMail}
                ></input>
                <br />
                <div>
                  <button
                    className={style.button}
                    onClick={() => saveInterlocutor()}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            onCancel={() => handleCloseModal()}
            open={showModalDoc}
            footer={null}
          >
            <div className={style.form}>
              <form>
                <label
                  htmlFor="filePicker"
                  className={style.customFileUpload + " " + style.button}
                >
                  Sélectionner un document
                </label>
                {inputValue}
                <br />
                <input
                  className={style.fileUpload}
                  type="file"
                  id="filePicker"
                  onChange={handleChange}
                  value={inputValue}
                />
                <br />
                <button
                  type="submit"
                  className={style.customFileUpload + " " + style.button}
                  onClick={() => handleSubmit()}
                >
                  Ajouter
                </button>
              </form>
            </div>
          </Modal>
          <Modal
            onCancel={() => handleCloseModal()}
            open={modalModifierSuccess}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ✅ Interlocutor modifié ! ✅
            </p>
          </Modal>
          <Modal
            onCancel={() => handleCloseModal()}
            open={modalModifierFailed}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ❌ Interlocutor non modifié ! ❌
            </p>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Contrat;

// Plan d'action pour Nico :
// Bouton modifier l'interloc
// - fait :  POST Interloc pour ajout d'un new interloc en db
// à faire : PUT Contrat pour modifier interloc contrat
// à faire : POST Client pour ajouter interlocutor

// - route PUT Contrat pour le modifier
// - route DELETE Contrat pour supprimer le contrat
// - route PUT Contrat pour mette à jour le link
