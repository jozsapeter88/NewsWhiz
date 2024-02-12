import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const TranslateModal = ({ onLanguageSelect, onHide, show }) => {
  const languages = [
    { code: "AR", name: "Arabic" },
    { code: "BG", name: "Bulgarian" },
    { code: "CS", name: "Czech" },
    { code: "DA", name: "Danish" },
    { code: "DE", name: "German" },
    { code: "EL", name: "Greek" },
    { code: "EN", name: "English" },
    { code: "EN-GB", name: "English (British)" },
    { code: "EN-US", name: "English (American)" },
    { code: "ES", name: "Spanish" },
    { code: "ET", name: "Estonian" },
    { code: "FI", name: "Finnish" },
    { code: "FR", name: "French" },
    { code: "HU", name: "Hungarian" },
    { code: "ID", name: "Indonesian" },
    { code: "IT", name: "Italian" },
    { code: "JA", name: "Japanese" },
    { code: "KO", name: "Korean" },
    { code: "LT", name: "Lithuanian" },
    { code: "LV", name: "Latvian" },
    { code: "NB", name: "Norwegian (Bokmål)" },
    { code: "NL", name: "Dutch" },
    { code: "PL", name: "Polish" },
    { code: "PT", name: "Portuguese" },
    { code: "PT-BR", name: "Portuguese (Brazilian)" },
    { code: "PT-PT", name: "Portuguese (European)" },
    { code: "RO", name: "Romanian" },
    { code: "RU", name: "Russian" },
    { code: "SK", name: "Slovak" },
    { code: "SL", name: "Slovenian" },
    { code: "SV", name: "Swedish" },
    { code: "TR", name: "Turkish" },
    { code: "UK", name: "Ukrainian" },
    { code: "ZH", name: "Chinese (simplified)" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLanguages, setFilteredLanguages] = useState(languages);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    const filtered = languages.filter((lang) =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLanguages(filtered);
  };

  const handleLanguageSelect = (code) => {
    onLanguageSelect(code);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Choose Language</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Search for a language"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
          {filteredLanguages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              style={{
                cursor: "pointer",
                marginBottom: "",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              {lang.name}
            </li>
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default TranslateModal;
