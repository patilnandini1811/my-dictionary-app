import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import AudioPlayer from './components/Audio';
import "./App.css";

function App() {
  const [word, setWord] = useState("");
  const [wordInfo, setWordInfo] = useState(null);
  const [error, setError] = useState("");
  const [searchWord, setSearchWord] = useState("");

  const fetchWordInfo = async () => {
    setError("");
    setWordInfo(null);
    if (word === "") {
      setError("Search field is empty.");
      return;
    }
    if (word.length === 1) {
      setError("Please enter a whole word!");
      return;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`);
      const data = await response.json();

      if (data.title === "No Definitions Found") {
        setError("No Definitions Found");
      } else {
        setWordInfo(data);
        setSearchWord(word);
      }

    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>My Dictionary App</h1>
        <img src={process.env.PUBLIC_URL + '/dictionary.png'} alt="Dictionary" />
        
      </div>
      <SearchBar setWord={setWord} fetchWordInfo={fetchWordInfo} />
      {wordInfo && (
        <div className="result-container">
          <h2>{searchWord}</h2>
          {wordInfo.map((entry, index) => (
            <div key={index}>
              {entry.phonetics.map((phonetic, phoneticIndex) => (
                phonetic.audio && (
                  <AudioPlayer key={phoneticIndex} audioSrc={phonetic.audio} />
                )
              ))}
              {entry.meanings.map((meaning, meaningIndex) => (
                <div key={meaningIndex}>
                  <h4>{meaning.partOfSpeech}</h4>
                  {meaning.definitions.map((definition, definitionIndex) => (
                    <div className="meaning-container" key={definitionIndex}>
                     <div> <h4>Definition:</h4>
                      <p>{definition.definition}</p></div>
                      {definition.example && <div><h4>Example:</h4><p>{definition.example}</p></div>}
{definition.synonyms && definition.synonyms.length > 0 && (
  <div><h4>Synonyms:</h4><p>{definition.synonyms.join(', ')}</p></div>
)}
{definition.antonyms && definition.antonyms.length > 0 && (
  <div><h4>Antonyms:</h4><p>{definition.antonyms.join(', ')}</p></div>
)}

                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {error && <div className="error-container"><p>{error}</p></div>}
    </div>
  );
}

export default App;


