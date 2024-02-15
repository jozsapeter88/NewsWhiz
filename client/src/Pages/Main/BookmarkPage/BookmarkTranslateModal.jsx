import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const TranslateModal = ({ onLanguageSelect, onHide, show }) => {
  const languages = [
    { code: "ar", name: "Arabic" },
    { code: "bg", name: "Bulgarian" },
    { code: "cs", name: "Czech" },
    { code: "da", name: "Danish" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "en", name: "English" },
    { code: "en-gb", name: "English (British)" },
    { code: "en-us", name: "English (American)" },
    { code: "es", name: "Spanish" },
    { code: "et", name: "Estonian" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "hu", name: "Hungarian" },
    { code: "id", name: "Indonesian" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "lt", name: "Lithuanian" },
    { code: "lv", name: "Latvian" },
    { code: "nb", name: "Norwegian (Bokmål)" },
    { code: "nl", name: "Dutch" },
    { code: "pl", name: "Polish" },
    { code: "pt", name: "Portuguese" },
    { code: "pt-br", name: "Portuguese (Brazilian)" },
    { code: "pt-pt", name: "Portuguese (European)" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "sk", name: "Slovak" },
    { code: "sl", name: "Slovenian" },
    { code: "sv", name: "Swedish" },
    { code: "tr", name: "Turkish" },
    { code: "uk", name: "Ukrainian" },
    { code: "zh", name: "Chinese (simplified)" },
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
