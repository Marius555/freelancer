"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Select, SelectItem, Input } from "@heroui/react";
import { Plus, X, ArrowRight, Languages, ArrowLeft } from "lucide-react";

const ThirdStep = ({ onNext, onBack, formData, setFormData }) => {
  const [languages, setLanguages] = useState(
    formData?.languages || []
  );

  const MAX_LANGUAGES = 5;

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "italian", label: "Italian" },
    { value: "portuguese", label: "Portuguese" },
    { value: "russian", label: "Russian" },
    { value: "chinese", label: "Chinese" },
    { value: "japanese", label: "Japanese" },
    { value: "korean", label: "Korean" },
    { value: "arabic", label: "Arabic" },
    { value: "hindi", label: "Hindi" },
    { value: "dutch", label: "Dutch" },
    { value: "swedish", label: "Swedish" },
    { value: "norwegian", label: "Norwegian" },
    { value: "danish", label: "Danish" },
    { value: "finnish", label: "Finnish" },
    { value: "polish", label: "Polish" },
    { value: "turkish", label: "Turkish" },
    { value: "greek", label: "Greek" },
  ];

  const proficiencyLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "native", label: "Native" },
  ];

  const addLanguage = () => {
    if (languages.length >= MAX_LANGUAGES) {
      return;
    }
    const newLanguage = {
      id: Date.now(),
      language: "",
      proficiency: "",
      isCustom: false,
    };
    setLanguages([...languages, newLanguage]);
  };

  const removeLanguage = (id) => {
    setLanguages(languages.filter((lang) => lang.id !== id));
  };

  const updateLanguage = (id, field, value) => {
    setLanguages(
      languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    );
  };

  const toggleCustomLanguage = (id) => {
    setLanguages(
      languages.map((lang) =>
        lang.id === id ? { ...lang, isCustom: !lang.isCustom, language: "" } : lang
      )
    );
  };

  const handleSubmit = () => {
    if (languages.length === 0) {
      return;
    }
    
    const validLanguages = languages.filter(
      (lang) => lang.language && lang.proficiency
    );
    
    if (validLanguages.length === 0) {
      return;
    }

    setFormData({ ...formData, languages: validLanguages });
    onNext();
  };

  const isFormValid = languages.length > 0 && 
    languages.every((lang) => lang.language && lang.proficiency);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3"
        >
          <Languages className="w-6 h-6 text-primary" />
        </motion.div>
        <h1 className="text-xl font-semibold mb-1  text-primary">
          Languages & Proficiency
        </h1>
        <p className="text-sm text-muted-foreground">
          Select the languages you know and your proficiency level (max {MAX_LANGUAGES})
        </p>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="sync">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="bg-card border border-foreground/5 rounded-lg p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  {lang.isCustom ? (
                    <Input
                      placeholder="Custom language"
                      value={lang.language}
                      onChange={(e) => updateLanguage(lang.id, "language", e.target.value)}
                      size="sm"
                      aria-label={`Custom language input for language ${index + 1}`}
                      classNames={{
                        input: "text-sm",
                        inputWrapper: "h-9",
                      }}
                    />
                  ) : (
                    <Select
                      placeholder="Language"
                      selectedKeys={lang.language ? [lang.language] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0];
                        updateLanguage(lang.id, "language", selected);
                      }}
                      size="sm"
                      aria-label={`Select language for language ${index + 1}`}
                      classNames={{
                        trigger: "h-9",
                        value: "text-sm",
                      }}
                    >
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  )}

                  <Select
                    placeholder="Level"
                    selectedKeys={lang.proficiency ? [lang.proficiency] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      updateLanguage(lang.id, "proficiency", selected);
                    }}
                    size="sm"
                    aria-label={`Select proficiency level for language ${index + 1}`}
                    classNames={{
                      trigger: "h-9",
                      value: "text-sm",
                    }}
                  >
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleCustomLanguage(lang.id)}
                    className="px-2 py-1 text-xs text-muted-foreground hover:text-primary transition-colors rounded"
                    title={lang.isCustom ? "Use predefined language" : "Add custom language"}
                    aria-label={lang.isCustom ? "Switch to predefined language" : "Switch to custom language"}
                  >
                    {lang.isCustom ? "Predefined" : "Custom"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeLanguage(lang.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded"
                    aria-label={`Remove language ${index + 1}`}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onPress={addLanguage}
            variant="bordered"
            size="sm"
            disabled={languages.length >= MAX_LANGUAGES}
            className={`w-full border-dashed border-2 transition-colors h-9 ${
              languages.length >= MAX_LANGUAGES 
                ? "border-muted-foreground/20 text-muted-foreground/50 cursor-not-allowed" 
                : "border-primary/30 hover:border-primary/50"
            }`}
            startContent={<Plus className="w-3 h-3" />}
            aria-label={`Add language (${languages.length}/${MAX_LANGUAGES})`}
          >
            {languages.length >= MAX_LANGUAGES 
              ? `Maximum ${MAX_LANGUAGES} languages reached` 
              : "Add Language"
            }
          </Button>
        </motion.div>

        {languages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-muted-foreground"
          >
            <p className="text-sm">No languages added yet</p>
            <p className="text-xs">Click "Add Language" to get started</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between gap-4 pt-4"
        >
          <Button
            onPress={onBack}
            className="flex-1 p-2 flex flex-row items-center justify-center gap-2 bg-default text-secondary-foreground rounded-lg hover: transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-small text-small">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onPress={handleSubmit}
            disabled={!isFormValid}
            className={`flex-1 px-8 py-2.5 bg-primary text-primary-foreground rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2 ${
              !isFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
            }`}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ThirdStep;
