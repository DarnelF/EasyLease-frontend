/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import style from "../styles/NewClient.module.css";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "antd";
import Header from "./Header";
const { checkBodyFront } = require("../modules/checkBody");

function NewClient() {
  // Définir l'état local pour les champs de formulaire
  let BACKEND_ADDRESS = "https://easylease-backend.vercel.app";

  const user = useSelector((state) => state.user.value);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [chiffreAffaire, setChiffreAffaire] = useState("");
  const [interlocName, setInterlocName] = useState("");
  const [phoneNumber, setPhoneNumer] = useState("");
  const [interlocFirstName, setInterlocFirstname] = useState("");
  const [interlocMail, setInterlocMail] = useState("");
  const [interlocJob, setInterlocJob] = useState("");
  const [interlocutors, setInterlocutors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [numberOfEmployees, setNumberofEmployees] = useState(0);
  const [newClientAdded, setNewClientAdded] = useState(false);
  const [alertInterlocutor, setAlertInterlocutor] = useState(false);
  console.log(newClientAdded);
  const deleteInt = (i) => {
    setInterlocutors(interlocutors.filter((_, index) => index !== i));
  };

  const modalContent = interlocutors.map((e, i) => {
    return (
      <div key={i} id={e} className={style.modalInterlocutorContainer}>
        <ul>
          <li>
            {e.firstname} {e.name} {e.poste}
            <FontAwesomeIcon
              onClick={() => deleteInt(i)}
              className={style.interlocutorDeleter}
              icon={faXmark}
              key={i}
            />
          </li>
        </ul>
      </div>
    );
  });

  const handleModalInterlocutor = () => {
    setIsModalVisible(!isModalVisible);
  };
  const dropDownInterlocutors = interlocutors.map((e, i) => {
    return (
      <div className={style.interlocuteurslist} key={i} value={e.name}>
        <span>Interlocuteur {i + 1}</span>
        <ul className={style.interlocuteursul}>
          <li className={style.interlocuteursli}>
            {e.firstname} _{e.name} : {e.poste}
          </li>
        </ul>
      </div>
    );
  });

  const [CheckBodyNonValid, setCheckBodyNonValid] = useState(false);

  const handleNewInterlocutorSubmit = () => {
    if (
      !checkBodyFront([
        interlocFirstName,
        interlocName,
        interlocMail,
        phoneNumber,
        interlocJob,
      ])
    ) {
      setCheckBodyNonValid(true);
      return;
    } else {
      setCheckBodyNonValid(false);
    }
    setInterlocutors((interlocutor) => [
      ...interlocutor,
      {
        firstname: interlocFirstName,
        name: interlocName,
        poste: interlocJob,
        phone: phoneNumber,
        email: interlocMail,
      },
    ]);
    setPhoneNumer("");
    setInterlocFirstname("");
    setInterlocName("");
    setInterlocMail("");
    setInterlocJob("");
    setAlertInterlocutor(false);
  };

  const handleNewClientSubmit = () => {
    if (interlocutors.length > 0) {
      fetch(`${BACKEND_ADDRESS}/client/uploadClient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: user.token,
          name: name,
          address: address,
          numberOfEmployees: numberOfEmployees,
          chiffreAffaire: chiffreAffaire,
          interlocutors: interlocutors,
          clientBirth: Date.now(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("TRUE, DATAS FROM CREATION CLIENT", data);
          if (data.result) {
            console.log("Client bien ajouté");
            setName("");
            setAddress("");
            setNumberofEmployees(0);
            setChiffreAffaire("");
            setNewClientAdded(true);
            setInterlocutors([]);
          } else if (!data.result) {
            console.log("ERREUR", data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setAlertInterlocutor(true);
    }
  };

  useEffect(() => {
    setInterlocutors([]);
  }, []);

  return (
    <div className={style.maincontainer}>
      <Navbar />
      <Header name="Nouveau Client" />
      <div className={style.container}>
        <div className={style.form}>
          <div className={style.newClientContainer}>
            <div className={style.formContainer}>
              <label>Nom</label>
              <input
                className={style.input + " " + style.inputNewClient}
                placeholder="Nom"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
              ></input>
              <label>Adresse</label>
              <input
                className={style.input + " " + style.inputNewClient}
                placeholder="Address"
                type="text"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              ></input>
              <label>Chiffre d'affaires</label>
              <input
                className={style.input + " " + style.inputNewClient}
                placeholder="Chiffre d'affaires"
                type="text"
                onChange={(e) => setChiffreAffaire(e.target.value)}
                value={chiffreAffaire}
              ></input>
              <div className={style.numberOfEmployeesContainer}>
                <label>Nombre d'employés:</label>
                <input
                  className={style.input + " " + style.inputNewClient}
                  placeholder="Nombre d'employés"
                  type="text"
                  onChange={(e) => setNumberofEmployees(e.target.value)}
                  value={numberOfEmployees}
                ></input>
              </div>
              {dropDownInterlocutors.length > 0 && (
                <div className={style.interlocutorItemListContainer}>
                  {dropDownInterlocutors}
                  <br />

                  <span
                    onClick={() => handleModalInterlocutor()}
                    className={style.textLink}
                  >
                    Modifier les interlocuteurs
                  </span>
                </div>
              )}
              {isModalVisible && (
                <div className={style.modal}>
                  <Modal closable={false} footer={null} open={isModalVisible}>
                    <div className={style.modalContainer}>
                      {modalContent}
                      <button
                        className={style.button}
                        onClick={() => handleModalInterlocutor()}
                      >
                        Ok
                      </button>
                    </div>
                  </Modal>
                </div>
              )}
              {newClientAdded && (
                <div className={style.modal}>
                  <Modal closable={false} footer={null} open={newClientAdded}>
                    <div className={style.modalContainer}>
                      <span>✅ Nouveau client ajouté ! ✅</span>
                      <button
                        className={style.button}
                        onClick={() => setNewClientAdded(false)}
                      >
                        Ok
                      </button>
                    </div>
                  </Modal>
                </div>
              )}
            </div>
          </div>

          <div className={style.newInterlocutorContainer}>
            <h3>Ajouter un interlocuteur : </h3>
            <input
              className={style.input + " " + style.inputNewInterlocutor}
              placeholder="Numéro de téléphone"
              type="text"
              onChange={(e) => setPhoneNumer(e.target.value)}
              value={phoneNumber}
            ></input>
            <input
              className={style.input + " " + style.inputNewInterlocutor}
              placeholder="Nom"
              type="text"
              onChange={(e) => setInterlocName(e.target.value)}
              value={interlocName}
            ></input>
            <input
              className={style.input + " " + style.inputNewInterlocutor}
              placeholder="Prénom"
              type="text"
              onChange={(e) => setInterlocFirstname(e.target.value)}
              value={interlocFirstName}
            ></input>
            <input
              className={style.input + " " + style.inputNewInterlocutor}
              placeholder="Email"
              type="text"
              onChange={(e) => setInterlocMail(e.target.value)}
              value={interlocMail}
            ></input>
            <input
              className={style.input + " " + style.inputNewInterlocutor}
              placeholder="Poste"
              type="text"
              onChange={(e) => setInterlocJob(e.target.value)}
              value={interlocJob}
            ></input>
            <button
              className={style.button}
              onClick={() => handleNewInterlocutorSubmit()}
            >
              Ajout Interlocuteur
            </button>
            {CheckBodyNonValid && (
              <p style={{ fontSize: 16, color: "red", margin: 10 }}>
                Champs vides ou manquants !
              </p>
            )}
          </div>

          <div className={style.buttonNewClientContainer}></div>
          {alertInterlocutor && (
            <span className={style.alert}>
              {" "}
              ❌ Ajoutez d'abord un interlocuteur ! ❌
            </span>
          )}
        </div>
        <div className={style.containerBtn}>
          <button
            className={style.button}
            onClick={() => handleNewClientSubmit()}
          >
            Création du client !
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewClient;
