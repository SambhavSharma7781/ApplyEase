// @ts-nocheck
'use client'

import { useContext, useState } from 'react';
import { Button, Dialog, Flex, Text, TextField, TextArea } from "@radix-ui/themes";
import { userContext } from '@/app/(group)/layout';

export default function EditBtn({ job }) {
    const [title, setTitle] = useState(job?.title || '');
    const [description, setDescription] = useState(job?.description || '');
    const context = useContext(userContext);
    

    if (!context) {
        return null; // Don't render if context is not available
    }
    
    const { user } = context;
    
    // Don't render if user is not loaded yet or if job data is missing
    if (!user || !job) {
        return null;
    }

    async function handleUpdate() {
        try {
            const res = await fetch("/api/job/" + job.id, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            const data = await res.json();

            if (data.success) {
                alert("Job updated successfully");
                window.location.reload();
            } else {
                alert("Something went wrong: " + (data.message || ""));
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong in the code");
        }
    }

    if (user?.company?.id && job?.company?.id && user.company.id === job.company.id) {

        return (
            <div>
                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <Button>Edit Job</Button>
                    </Dialog.Trigger>

                    <Dialog.Content maxWidth="450px">
                        <Dialog.Title>Edit Job Details</Dialog.Title>

                        <Flex direction="column" gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Job Title
                                </Text>
                                <TextField.Root
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter the job title"
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Description
                                </Text>
                                <TextArea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter the job description"
                                    size="3"
                                />
                            </label>
                        </Flex>

                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button onClick={handleUpdate}>Save Changes</Button>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            </div>
        );
    }

    // Return null if user doesn't have permission to edit
    return null;
}