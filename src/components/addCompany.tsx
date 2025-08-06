//@ts-nocheck
"use client";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";

export default function AddCompany() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !description ) {
      alert("Please fill all fields.");
      return;
    }
    const companyData = {
      name,
      description,
    }
    const res = await fetch("/api/company", {
      method: "POST",
      body: JSON.stringify(companyData),
    });
    const data = await res.json();  
    if (data.success) {
      alert("Company created successfully");
      setName("");
      setDescription("");
    } else {
      alert("Failed to create company: " + data.message);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Add Company</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Add Company</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Fill in the details to add a new company.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter company name"
            />
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Description
            </Text>
            <TextField.Root
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter company description"
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={handleSubmit}>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}