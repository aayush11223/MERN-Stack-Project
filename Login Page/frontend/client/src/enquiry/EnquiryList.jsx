import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
} from 'flowbite-react';

import PropTypes from 'prop-types';

// deletion is handled by parent via onDelete prop; keeping this component "dumb" makes
// it easier to reuse and to test.  The parent is responsible for calling the API and
// updating the list.

function EnquiryList({ data = [], onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md mt-6">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeadCell className="text-left">S no</TableHeadCell>
                        <TableHeadCell className="text-left">Name</TableHeadCell>
                        <TableHeadCell className="text-left">Email</TableHeadCell>
                        <TableHeadCell className="text-left">Phone</TableHeadCell>
                        <TableHeadCell className="text-left">Message</TableHeadCell>
                        <TableHeadCell className="text-left">Edit</TableHeadCell>
                        <TableHeadCell className="text-left">Delete</TableHeadCell>
                    </TableRow>
                </TableHead>

                <TableBody className="divide-y">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <TableRow key={item._id || index}>
                                <TableCell className="py-2 text-left">{index + 1}</TableCell>
                                <TableCell className="py-2 text-left">{item.name}</TableCell>
                                <TableCell className="py-2 text-left">{item.email}</TableCell>
                                <TableCell className="py-2 text-left">{item.phone}</TableCell>
                                <TableCell className="py-2 text-left">{item.message}</TableCell>
                                <TableCell className="py-2 text-left">
                                    <button
                                        onClick={() => onEdit && onEdit(item)}
                                        className="font-medium text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                </TableCell>
                                <TableCell className="py-2 text-left">
                                    <button
                                        onClick={() => onDelete && onDelete(item._id)}
                                        className="font-medium text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="py-2 text-center">
                                No enquiries found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

EnquiryList.propTypes = {
    data: PropTypes.array,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

export default EnquiryList;
