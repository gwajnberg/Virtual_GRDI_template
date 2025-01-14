import React, {useState, useEffect} from 'react';
import { Nav,  Form } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import jsonData from './templates/schema.json';


const Sidebar = () => {

  
const [data, setData] = useState(null);
const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

  useEffect(() => {
    // Read the JSON file and set the data once
    setData(jsonData);

    const initializeCheckboxes = (obj, path = '') => {
      Object.keys(obj).forEach((key) => {
        const newPath = path ? `${path}.${key}` : key;
        setSelectedCheckboxes((prevState) => ({
          ...prevState,
          [newPath]: false,
        }));
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          initializeCheckboxes(obj[key], newPath);
        }
      });
    };
  
    initializeCheckboxes(jsonData);
    //console.log("INHERE",selectedCheckboxes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCheckbox = (check) => {
    setSelectedCheckboxes((prevState) => {
      //console.log("taaki",check['key'])
      const updatedState = { ...prevState };
      
  
      // Iterate over the keys and update checkboxes with the same prefix
      Object.keys(updatedState).forEach((key) => {
       // console.log(key,check)
        if (key.startsWith(`${check}.`) || (key === check)) {
          //console.log("here happens")
          updatedState[key] = !prevState[key]; // Toggle checkbox value
          //console.log(updatedState[key])
        }
      });
      console.log(updatedState)
      return updatedState;
    });
  };
  const keys = data && Object.keys(data);
  //console.log(keys)
  


  
  // Render Form.Check components for subkeys with null values
  const renderSubKeys = (subKeys, value,path) => {
    return subKeys.map((subKey, index) => {
      const subValue = value[subKey];
      
     const prefix = `${path}.${subKey}`
      if (subValue && typeof subValue === "object") {
        // If the subValue is an object, render it as an accordion

        return (
          <Accordion key={index}>
            <Accordion.Item eventKey={index.toString()}>
              <Accordion.Header>{subKey}</Accordion.Header>
              <Accordion.Body>
              <Form.Check 
              type="checkbox" 
              label={`All ${subKey}`} 
              checked= {selectedCheckboxes[prefix]} 
              onChange={() => toggleCheckbox(prefix)}
              />
                {renderSubKeys(Object.keys(subValue), subValue, prefix)}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        );
      } else {
        //const prefix = `${path}.${subKey}`
        console.log(prefix)
        // Render a regular Form.Check component
        return (
          <Form.Check 
          key={index} type="checkbox" 
          label={subKey}
          checked= {selectedCheckboxes[prefix]} 
          onChange={() => toggleCheckbox(prefix)}
          
           />
        );
      }
    });
  };


  const accordionItems = keys && keys.map((key, index) => {
    
    const value = data[key];
    const subKeys = value && Object.keys(value);
    
    return(
    <Accordion.Item key={index} eventKey={index.toString()}>
      <Accordion.Header>{key}</Accordion.Header>
      <Accordion.Body>
      <Form.Check 
      type="checkbox" 
      label={`All ${key}`} 
      //checked={selectedCheckboxes[{key}] || false} // Set to false if undefined
      onChange={() => toggleCheckbox(key)}
      />
          
          {subKeys && renderSubKeys(subKeys,value,key)}
      </Accordion.Body>
      
    </Accordion.Item>
    );
  });
  
  
  return (
    <Nav defaultActiveKey="/home" className="flex-column">
      <Accordion  defaultActiveKey={null} style={{ width: '500px' }}>
      {accordionItems}
    </Accordion>
    </Nav>
  );
};

export default Sidebar;