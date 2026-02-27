import React, { useEffect, useState } from 'react';
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import EnquiryList from './enquiry/EnquiryList';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2/dist/sweetalert2.js'


export default function Enquiry() {
    const [enquiryList, setEnquiryList] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    // Fetch enquiries on component mount
    useEffect(() => {
        getAllEnquiry();
    }, []);

    // Save enquiry
    const saveEnquiry = (e) => {
        e.preventDefault();

        axios.post("http://localhost:3000/api/website/enquiry/insert", formData)
            .then((res) => {
                console.log("Saved:", res.data);
                toast.success("Enquiry saved successfully!");
                setFormData({ name: '', email: '', phone: '', message: '' });
                getAllEnquiry(); // refresh list
            })
            .catch((err) => {
                console.error("Error:", err);
                toast.error("Failed to save enquiry. Please try again.");
            });
    };

    // Handle input change
    const getValue = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Fetch all enquiries
    const getAllEnquiry = () => {
        axios.get("http://localhost:3000/api/website/enquiry/view")
            .then((res) => {
                console.log("Fetched enquiries:", res.data);
                // Adjust property name based on backend response
                if (res.data.status === 1) {
                    setEnquiryList(res.data.enquiryList || res.data.enquiry);
                }
            })
            .catch((err) => {
                console.error("Error fetching enquiries:", err);
            });
    };

    // Delete an enquiry by ID with SweetAlert2 confirmation
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This enquiry will be deleted permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3000/api/website/enquiry/delete/${id}`)
                    .then((res) => {
                        toast.success(res.data.message || 'Enquiry deleted successfully');
                        // refresh the data from server after deletion
                        getAllEnquiry();
                    })
                    .catch((err) => {
                        toast.error('Failed to delete enquiry');
                        console.error('Deletion error:', err);
                    });
            }
        });
    };

    // Edit an enquiry with SweetAlert2 form
    const handleEdit = (item) => {
        Swal.fire({
            title: 'Edit Enquiry',
            html: `
                <div style="text-align: left;">
                    <label for="edit-name" style="display: block; margin-bottom: 8px; font-weight: bold;">Name</label>
                    <input type="text" id="edit-name" class="swal2-input" value="${item.name}" placeholder="Name">
                    
                    <label for="edit-email" style="display: block; margin: 12px 0 8px; font-weight: bold;">Email</label>
                    <input type="email" id="edit-email" class="swal2-input" value="${item.email}" placeholder="Email">
                    
                    <label for="edit-phone" style="display: block; margin: 12px 0 8px; font-weight: bold;">Phone</label>
                    <input type="text" id="edit-phone" class="swal2-input" value="${item.phone}" placeholder="Phone">
                    
                    <label for="edit-message" style="display: block; margin: 12px 0 8px; font-weight: bold;">Message</label>
                    <textarea id="edit-message" class="swal2-textarea" placeholder="Message" style="width: 100%; height: 100px; padding: 8px;">${item.message}</textarea>
                </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Save Changes',
            cancelButtonText: 'Cancel',
            didOpen: (modal) => {
                // Focus on first input
                document.getElementById('edit-name').focus();
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const name = document.getElementById('edit-name').value;
                const email = document.getElementById('edit-email').value;
                const phone = document.getElementById('edit-phone').value;
                const message = document.getElementById('edit-message').value;

                // Validate inputs
                if (!name || !email || !phone || !message) {
                    toast.error('All fields are required!');
                    return;
                }

                axios.put(`http://localhost:3000/api/website/enquiry/update/${item._id}`, {
                    name,
                    email,
                    phone,
                    message
                })
                    .then((res) => {
                        toast.success(res.data.message || 'Enquiry updated successfully');
                        getAllEnquiry();
                    })
                    .catch((err) => {
                        toast.error('Failed to update enquiry');
                        console.error('Update error:', err);
                    });
            }
        });
    };

    return (
        <div>
            <h1 className='text-[40px] text-center font-bold py-6'>User Enquiry</h1>
            <div className='grid grid-cols-[30%_auto] gap-10'>
                <div className='bg-gray-100 p-4'>
                    <h2 className='text-[20px] font-bold'>Enquiry Form</h2>
                    <form onSubmit={saveEnquiry}>
                        <div className='py-3'>
                            <Label htmlFor="name">Your Name</Label>
                            <TextInput
                                className='bg-white'
                                value={formData.name}
                                onChange={getValue}
                                name="name"
                                type="text"
                                placeholder="Your Name"
                                required
                                shadow
                            />
                        </div>
                        <div className='py-3'>
                            <Label htmlFor="email">Your Email</Label>
                            <TextInput
                                className='bg-white'
                                value={formData.email}
                                onChange={getValue}
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                shadow
                            />
                        </div>
                        <div className='py-3'>
                            <Label htmlFor="phone">Your Phone</Label>
                            <TextInput
                                className='bg-white'
                                value={formData.phone}
                                onChange={getValue}
                                name="phone"
                                type="text"
                                placeholder="Your Phone Number"
                                required
                                shadow
                            />
                        </div>
                        <div className='py-3'>
                            <Label htmlFor="message">Your Message</Label>
                            <Textarea
                                className='bg-white'
                                value={formData.message}
                                onChange={getValue}
                                name="message"
                                placeholder="Your Message"
                                required
                                shadow
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                        >
                            Save
                        </Button>
                    </form>
                </div>

                {/* Pass enquiryList to EnquiryList along with handlers */}
                <EnquiryList
                    data={enquiryList}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
