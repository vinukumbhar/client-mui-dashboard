import {
  MenuItem,
  Select,
  FormControl,
  Dialog,
  DialogContent,
  DialogTitlen,
  Typography,
  DialogTitle,
  IconButton,
  Box,
  TextField,CircularProgress,
  Button,
} from "@mui/material";
import { debounce } from 'lodash';
import { LinearProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState,useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from 'dayjs';
const OrganizerDialog = ({ open, handleClose, organizer }) => {
  const sections = organizer?.sections; // Assigned const here
  console.log("organizer", sections);
    // Initialize state with existing values from form elements
  const initializeState = () => {
    const initialInputValues = {};
    const initialSelectedDropdownValues = {};
    const initialSelectedYesNoValues = {};
    const initialRadioValues = {};
    const initialCheckboxValues = {};
    const initialAnsweredElements = {};
    const initialStartDate = null;

    sections?.forEach(section => {
      section.formElements?.forEach(element => {
        const key = `${section.id}_${element.text}`;
        
        if (element.textvalue) {
          initialAnsweredElements[key] = true;
          
          switch(element.type) {
            case 'Free Entry':
            case 'Email':
            case 'Number':
              initialInputValues[key] = element.textvalue;
              break;
            case 'Dropdown':
              initialSelectedDropdownValues[key] = element.textvalue;
              break;
            case 'Yes/No':
              initialSelectedYesNoValues[key] = element.textvalue;
              break;
            case 'Radio Buttons':
              initialRadioValues[key] = element.textvalue;
              break;
            case 'Checkboxes':
              // Assuming textvalue is an object with checkbox values
              initialCheckboxValues[key] = element.textvalue;
              break;
            case 'Date':
              if (element.textvalue) {
                initialStartDate = dayjs(element.textvalue);
              }
              break;
          }
        }
      });
    });

    return {
      initialInputValues,
      initialSelectedDropdownValues,
      initialSelectedYesNoValues,
      initialRadioValues,
      initialCheckboxValues,
      initialAnsweredElements,
      initialStartDate
    };
  };

  const {
    initialInputValues,
    initialSelectedDropdownValues,
    initialSelectedYesNoValues,
    initialRadioValues,
    initialCheckboxValues,
    initialAnsweredElements,
    initialStartDate
  } = initializeState();
  const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [answeredElements, setAnsweredElements] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const handleRadioChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setRadioValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  const handleCheckboxChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [key]: {
        ...prevValues[key],
        [value]: !prevValues[key]?.[value],
      },
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleYesNoChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedYesNoValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleInputChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    const { value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  const handleDropdownValueChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: event.target.value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  const shouldShowSection = (section) => {
    if (!section.sectionsettings?.conditional) return true;
    const conditions = section.sectionsettings.conditions || [];

    return conditions.every((condition) => {
      if (!condition.question || !condition.answer) return false;

      // Check all possible sections for the answer
      for (const key in radioValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          radioValues[key] === condition.answer
        ) {
          return true;
        }
      }

      for (const key in checkboxValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          checkboxValues[key]?.[condition.answer]
        ) {
          return true;
        }
      }

      for (const key in selectedDropdownValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          selectedDropdownValues[key] === condition.answer
        ) {
          return true;
        }
      }
      // Check Yes/No values
      for (const key in selectedYesNoValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          selectedYesNoValues[key] === condition.answer
        ) {
          return true;
        }
      }
      return false;
    });
  };

  //   const getVisibleSections = () => sections.filter(shouldShowSection);
  const getVisibleSections = () => (sections || []).filter(shouldShowSection);

  const visibleSections = getVisibleSections();
  const totalSteps = visibleSections.length;

  const shouldShowElement = (element, sectionId) => {
    const settings = element.questionsectionsettings;
    if (!settings?.conditional) return true;
    const conditions = settings?.conditions || [];

    for (const condition of conditions) {
      const { question, answer } = condition;
      if (!question || !answer) continue;

      // Check all possible sections for the answer
      let conditionMet = false;

      // Check radio values
      for (const key in radioValues) {
        if (key.endsWith(`_${question}`) && radioValues[key] === answer) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      // Check checkbox values
      for (const key in checkboxValues) {
        if (key.endsWith(`_${question}`) && checkboxValues[key]?.[answer]) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      // Check dropdown values
      for (const key in selectedDropdownValues) {
        if (
          key.endsWith(`_${question}`) &&
          selectedDropdownValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;
      // Check Yes/No values
      for (const key in selectedYesNoValues) {
        if (
          key.endsWith(`_${question}`) &&
          selectedYesNoValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;
      // If we get here, no condition was met
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleDropdownChange = (event) => {
    const selectedIndex = event.target.value;
    setActiveStep(selectedIndex);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };


   const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null)
  // Debounced auto-save function
  const autoSaveOrganizer = debounce(async () => {
    if (!open) return; // Don't save if dialog is closed
    
    setIsSaving(true);
    try {
      // Prepare the data structure for saving
      const organizerData = {
        accountid: organizer.accountId, // Make sure this is available in your organizer prop
        organizertemplateid: organizer.organizerTemplateId, // Make sure this is available
        sections: organizer.sections?.map((section) => ({
          id: section.id,
          text: section.text,
          formElements: section.formElements?.map((element) => {
            const elementKey = `${section.id}_${element.text}`;
            
            // Determine the value based on element type
            let value;
            switch(element.type) {
              case 'Radio Buttons':
                value = radioValues[elementKey] || '';
                break;
              case 'Checkboxes':
                value = checkboxValues[elementKey] || {};
                break;
              case 'Yes/No':
                value = selectedYesNoValues[elementKey] || '';
                break;
              case 'Dropdown':
                value = selectedDropdownValues[elementKey] || '';
                break;
              case 'Free Entry':
              case 'Email':
              case 'Number':
                value = inputValues[elementKey] || '';
                break;
              case 'Date':
                value = startDate ? startDate.toISOString() : '';
                break;
            //   case 'File Upload':
            //     value = fileInputs[element.id] ? 'File uploaded' : '';
            //     break;
              default:
                value = '';
            }

            return {
              id: element.id,
              type: element.type,
              text: element.text,
              textvalue: value,
              options: element.options?.map(opt => ({
                id: opt.id,
                text: opt.text,
                selected: element.type === 'Checkboxes' 
                  ? checkboxValues[elementKey]?.[opt.text] || false
                  : (element.type === 'Radio Buttons' || element.type === 'Dropdown' || element.type === 'Yes/No')
                    ? value === opt.text
                    : false
              })) || []
            };
          }) || []
        })) || []
      };

    //   // First handle file uploads if any
    //   const fileUploadPromises = [];
    //   organizer.sections?.forEach((section) => {
    //     section.formElements?.forEach((element) => {
    //       if (element.type === "File Upload" && fileInputs[element.id]) {
    //         const formData = new FormData();
    //         formData.append("file", fileInputs[element.id]);
    //         formData.append("destinationPath", `uploads/AccountId/${organizer.accountId}/Client Uploaded Documents/unsealed`);
            
    //         fileUploadPromises.push(
    //           fetch(`${DOCS_MANAGMENTS}/uploadfiledocument`, {
    //             method: "POST",
    //             body: formData,
    //           }).then(response => response.json())
    //         );
    //       }
    //     });
    //   });

      // Wait for file uploads to complete
    //   await Promise.all(fileUploadPromises);

      // Then save the organizer data
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const response = await fetch(`http://127.0.0.1/workflow/orgaccwise/organizeraccountwise/${organizer._id}`, {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify(organizerData),
        redirect: "follow"
      });

      const result = await response.json();
      setLastSaved(new Date());
      return result;
    } catch (error) {
      console.error("Auto-save failed:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, 2000); // 2 second debounce

  // Effect to trigger auto-save when answers change
  useEffect(() => {
    if (open) { // Only save when dialog is open
      autoSaveOrganizer();
    }
    
    // Cleanup
    return () => {
      autoSaveOrganizer.cancel();
    };
  }, [
    selectedDropdownValues,
    inputValues,
    selectedYesNoValues,
    radioValues,
    checkboxValues,
    startDate,
    // fileInputs,
    open
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
            borderBottom: "1px solid #ddd",
          }}
        >
          <Typography variant="h6" component="p">
            {organizer?.organizerName || "Organizer"}
          </Typography>
          <IconButton edge="end" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl
            fullWidth
            sx={{ marginBottom: "10px", marginTop: "10px" }}
          >
            <Select
              value={activeStep}
              onChange={handleDropdownChange}
              size="small"
            >
              {visibleSections.map((section, index) => {
                // Calculate answered elements count for this specific section
                const answeredCount = section.formElements.reduce(
                  (count, element) => {
                    const key = `${section.id}_${element.text}`;
                    return count + (answeredElements[key] ? 1 : 0);
                  },
                  0
                );

                const totalElements = section.formElements.length;

                return (
                  <MenuItem key={section.id} value={index}>
                    {section.text} ({answeredCount}/{totalElements})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box mt={2} mb={2}>
            <LinearProgress
              variant="determinate"
              value={((activeStep + 1) / totalSteps) * 100}
            />
          </Box>

          <Box sx={{ pl: 20, pr: 20 }}>
            {/* {visibleSections.map(
              (section, sectionIndex) =>
                sectionIndex === activeStep && (
                  <Box key={section.id}>
                    {section.formElements.map(
                      (element) =>
                        shouldShowElement(element, section.id) && (
                          <Box key={`${section.id}_${element.id}`}>
                           
                            {element.type === "Text Editor" && (
                              <Box mt={2} mb={2}>
                                <Typography>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: element.text,
                                    }}
                                  />
                                </Typography>
                              </Box>
                            )}

                            
                            {(element.type === "Free Entry" ||
                              element.type === "Email") && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  multiline
                                  fullWidth
                                  placeholder={`${element.type} Answer`}
                                  inputProps={{
                                    type:
                                      element.type === "Free Entry"
                                        ? "text"
                                        : element.type.toLowerCase(),
                                  }}
                                  maxRows={8}
                                  style={{ display: "block" }}
                                  value={
                                    inputValues[
                                      `${section.id}_${element.text}`
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      element.text,
                                      section.id
                                    )
                                  }
                                />
                              </Box>
                            )}

                         
                            {element.type === "Number" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  multiline
                                  fullWidth
                                  placeholder={`${element.type} Answer`}
                                  inputProps={{
                                    type: "text",
                                    inputMode: "numeric",
                                    pattern: "[0-9]*",
                                  }}
                                  maxRows={8}
                                  style={{
                                    display: "block",
                                    marginTop: "15px",
                                  }}
                                  value={
                                    inputValues[
                                      `${section.id}_${element.text}`
                                    ] || ""
                                  }
                                  onChange={(e) => {
                                    const numericValue = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    handleInputChange(
                                      { target: { value: numericValue } },
                                      element.text,
                                      section.id
                                    );
                                  }}
                                />
                              </Box>
                            )}

                           
                            {element.type === "Radio Buttons" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {element.options.map((option) => (
                                    <Button
                                      key={option.text}
                                      variant={
                                        radioValues[
                                          `${section.id}_${element.text}`
                                        ] === option.text
                                          ? "contained"
                                          : "outlined"
                                      }
                                      onClick={() =>
                                        handleRadioChange(
                                          option.text,
                                          element.text,
                                          section.id
                                        )
                                      }
                                      sx={{
                                        borderRadius: "15px",
                                        ...(radioValues[
                                          `${section.id}_${element.text}`
                                        ] === option.text),
                                      }}
                                    >
                                      {option.text}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            
                            {element.type === "Checkboxes" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {element.options.map((option) => (
                                    <Button
                                      key={option.text}
                                      variant={
                                        checkboxValues[
                                          `${section.id}_${element.text}`
                                        ]?.[option.text]
                                          ? "contained"
                                          : "outlined"
                                      }
                                      onClick={() =>
                                        handleCheckboxChange(
                                          option.text,
                                          element.text,
                                          section.id
                                        )
                                      }
                                      sx={{
                                        borderRadius: "15px",
                                        ...checkboxValues[
                                          `${section.id}_${element.text}`
                                        ]?.[option.text],
                                      }}
                                    >
                                      {option.text}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            
                            {element.type === "Yes/No" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  {element.options.map((option) => (
                                    <Button
                                      key={option.text}
                                      variant={
                                        selectedYesNoValues[
                                          `${section.id}_${element.text}`
                                        ] === option.text
                                          ? "contained"
                                          : "outlined"
                                      }
                                      onClick={() =>
                                        handleYesNoChange(
                                          option.text,
                                          element.text,
                                          section.id
                                        )
                                      }
                                      sx={{
                                        borderRadius: "15px",
                                        ...(selectedYesNoValues[
                                          `${section.id}_${element.text}`
                                        ] === option.text),
                                      }}
                                    >
                                      {option.text}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                           
                            {element.type === "Dropdown" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <FormControl fullWidth>
                                  <Select
                                    value={
                                      selectedDropdownValues[
                                        `${section.id}_${element.text}`
                                      ] || ""
                                    }
                                    onChange={(event) =>
                                      handleDropdownValueChange(
                                        event,
                                        element.text,
                                        section.id
                                      )
                                    }
                                    size="small"
                                  >
                                    {element.options.map((option) => (
                                      <MenuItem
                                        key={option.text}
                                        value={option.text}
                                      >
                                        {option.text}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Box>
                            )}

                            {element.type === "Date" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <DatePicker
                                  format="DD/MM/YYYY"
                                  sx={{
                                    width: "100%",
                                    backgroundColor: "#fff",
                                  }}
                                  selected={startDate}
                                  onChange={handleStartDateChange}
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" />
                                  )}
                                  onOpen={() =>
                                    setAnsweredElements((prevAnswered) => ({
                                      ...prevAnswered,
                                      [`${section.id}_${element.text}`]: true,
                                    }))
                                  }
                                />
                              </Box>
                            )}

                            
                            {element.type === "File Upload" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                this file upload question
                              </Box>
                            )}
                          </Box>
                        )
                    )}
                  </Box>
                )
            )} */}
{visibleSections.map(
              (section, sectionIndex) =>
                sectionIndex === activeStep && (
                  <Box key={section.id}>
                    {section.formElements.map(
                      (element) =>
                        shouldShowElement(element, section.id) && (
                          <Box key={`${section.id}_${element.id}`}>
                            {/* Text Editor */}
                            {element.type === "Text Editor" && (
                              <Box mt={2} mb={2}>
                                <Typography>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: element.text,
                                    }}
                                  />
                                </Typography>
                              </Box>
                            )}

                            {/* Free Entry or Email */}
                            {(element.type === "Free Entry" ||
                              element.type === "Email") && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  multiline
                                  fullWidth
                                  placeholder={`${element.type} Answer`}
                                  inputProps={{
                                    type:
                                      element.type === "Free Entry"
                                        ? "text"
                                        : element.type.toLowerCase(),
                                  }}
                                  maxRows={8}
                                  style={{ display: "block" }}
                                  value={
                                    inputValues[`${section.id}_${element.text}`] || 
                                    element.textvalue || 
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      element.text,
                                      section.id
                                    )
                                  }
                                />
                              </Box>
                            )}

                            {/* Number */}
                            {element.type === "Number" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  multiline
                                  fullWidth
                                  placeholder={`${element.type} Answer`}
                                  inputProps={{
                                    type: "text",
                                    inputMode: "numeric",
                                    pattern: "[0-9]*",
                                  }}
                                  maxRows={8}
                                  style={{
                                    display: "block",
                                    marginTop: "15px",
                                  }}
                                  value={
                                    inputValues[`${section.id}_${element.text}`] || 
                                    element.textvalue || 
                                    ""
                                  }
                                  onChange={(e) => {
                                    const numericValue = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    handleInputChange(
                                      { target: { value: numericValue } },
                                      element.text,
                                      section.id
                                    );
                                  }}
                                />
                              </Box>
                            )}

                            {/* Radio Buttons */}
                            {element.type === "Radio Buttons" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {element.options.map((option) => (
                                    <Button
                                      key={option.text}
                                      variant={
                                        (radioValues[`${section.id}_${element.text}`] === option.text) ||
                                        (element.textvalue === option.text)
                                          ? "contained"
                                          : "outlined"
                                      }
                                      onClick={() =>
                                        handleRadioChange(
                                          option.text,
                                          element.text,
                                          section.id
                                        )
                                      }
                                      sx={{
                                        borderRadius: "15px",
                                      }}
                                    >
                                      {option.text}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {/* Checkboxes */}
                            {element.type === "Checkboxes" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {element.options.map((option) => (
                                    <Button
                                      key={option.text}
                                      variant={
                                        (checkboxValues[`${section.id}_${element.text}`]?.[option.text]) ||
                                        (element.textvalue && element.textvalue[option.text])
                                          ? "contained"
                                          : "outlined"
                                      }
                                      onClick={() =>
                                        handleCheckboxChange(
                                          option.text,
                                          element.text,
                                          section.id
                                        )
                                      }
                                      sx={{
                                        borderRadius: "15px",
                                      }}
                                    >
                                      {option.text}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {/* Yes/No */}
                            {element.type === "Yes/No" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  {element.options.map((option) => (
                                    <Button
                                      key={option.text}
                                      variant={
                                        (selectedYesNoValues[`${section.id}_${element.text}`] === option.text) ||
                                        (element.textvalue === option.text)
                                          ? "contained"
                                          : "outlined"
                                      }
                                      onClick={() =>
                                        handleYesNoChange(
                                          option.text,
                                          element.text,
                                          section.id
                                        )
                                      }
                                      sx={{
                                        borderRadius: "15px",
                                      }}
                                    >
                                      {option.text}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {/* Dropdown */}
                            {element.type === "Dropdown" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <FormControl fullWidth>
                                  <Select
                                    value={
                                      selectedDropdownValues[`${section.id}_${element.text}`] || 
                                      element.textvalue || 
                                      ""
                                    }
                                    onChange={(event) =>
                                      handleDropdownValueChange(
                                        event,
                                        element.text,
                                        section.id
                                      )
                                    }
                                    size="small"
                                  >
                                    {element.options.map((option) => (
                                      <MenuItem
                                        key={option.text}
                                        value={option.text}
                                      >
                                        {option.text}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Box>
                            )}

                            {/* Date */}
                            {element.type === "Date" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <DatePicker
                                  format="DD/MM/YYYY"
                                  sx={{
                                    width: "100%",
                                    backgroundColor: "#fff",
                                  }}
                                  value={
                                    startDate || 
                                    (element.textvalue ? dayjs(element.textvalue) : null)
                                  }
                                  onChange={handleStartDateChange}
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" />
                                  )}
                                  onOpen={() =>
                                    setAnsweredElements((prevAnswered) => ({
                                      ...prevAnswered,
                                      [`${section.id}_${element.text}`]: true,
                                    }))
                                  }
                                />
                              </Box>
                            )}

                            {/* File Upload */}
                            {element.type === "File Upload" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                {element.textvalue ? (
                                  <Typography variant="body2" color="textSecondary">
                                    File already uploaded: {element.textvalue}
                                  </Typography>
                                ) : (
                                  "This file upload question"
                                )}
                              </Box>
                            )}
                          </Box>
                        )
                    )}
                  </Box>
                )
            )}
     

            <Box
              mt={3}
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Box display="flex" gap={3} alignItems="center">
                {activeStep > 0 && (
                  <Button onClick={handleBack} variant="outlined">
                    <ArrowBackIcon fontSize="small" />
                  </Button>
                )}

                {activeStep < totalSteps - 1 ? (
                  <Button onClick={handleNext} variant="contained">
                    Next{" "}
                    <ArrowForwardIcon fontSize="small" sx={{ marginLeft: 2 }} />
                  </Button>
                ) : (
                  <Button variant="contained">Submit</Button>
                )}
              </Box>
               {isSaving && (
        <CircularProgress size={20} />
      )}
      {lastSaved && !isSaving && (
        <Typography variant="caption" color="textSecondary">
          Last saved: {lastSaved.toLocaleTimeString()}
        </Typography>
      )}
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Typography>
                  Step {activeStep + 1} of {totalSteps}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};

export default OrganizerDialog;
