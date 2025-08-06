//@ts-nocheck
'use client'
import { Button } from "@radix-ui/themes";
export default function DeleteCompany({ companyId }) {
    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/company/${companyId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error("Server returned error response");
            }

            const data = await res.json(); 

            if (data.success) {
                alert("Company deleted successfully");
                window.location.href = '/';
            } else {
                alert(data.message || "Deletion failed");
            }

        } catch (err) {
            alert("Something went wrong while deleting the company.");
            console.error("Delete error:", err);
        }
    };
    

    return (
        <Button onClick={handleDelete} className="btn btn-danger">
            Delete Company
        </Button>
    );
}