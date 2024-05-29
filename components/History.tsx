"use client";
import { axiosInstance } from '@/utils/instance';
import React, { useEffect, useState } from 'react'
import { HiOutlineRefresh } from "react-icons/hi";
import { RiDeleteBin6Fill } from "react-icons/ri";

interface Props {
    setResult: React.Dispatch<React.SetStateAction<string>>;
    history: HistoryItem[];
    setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
}

interface HistoryItem {
    _id: string;
    calculationName: string;
    calculationPattern: string;
    result: string;
}


const History = ({ setResult, history, setHistory }: Props) => {

    const [calculationIds, setCalculationIds] = useState<string[]>([]);

    const handleSelectMultiple = (checked: boolean) => {
        if (checked) {
            if (history.length > 0) {
                history.forEach((item: HistoryItem) => {
                    setCalculationIds((prevState) => [...prevState, item._id])
                })
            }
        } else {
            setCalculationIds([])
        }

    }

    const handleSelection = (e: React.ChangeEvent<HTMLInputElement>, item: HistoryItem) => {
        if (!e.target.checked) {
            setCalculationIds((prevState) => prevState.filter((id) => id !== item._id));
        } else {
            setCalculationIds((prevState) => [...prevState, item._id])
        }
    }

    useEffect(() => {
        axiosInstance.getData('/user/history')
            .then((response) => {
                setHistory(response.userHistory.history)
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const deleteHistory = (postBody:{ ids: string[] }) => {
        axiosInstance.deleteWithData('/user/delete-history', postBody)
        .then((response) => {
            console.log("response", response);
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const handleDelete = (id: string) => {
        if (id.length > 0) {

            const postBody = {
                ids: [id]
            }

            deleteHistory(postBody)
        }
    }

    const handleMultipleDelete = () => {
        if (calculationIds.length > 0) {
            const postBody = {
                ids: calculationIds
            }

            deleteHistory(postBody)
        }
    }

    return (
        <div className="w-auto space-y-3 md:px-10 sm:px-5 text-black">
            <h2 className='heading'>Your Calculations</h2>

            {history.length > 0 ? (
                <table className='custom-table'>
                    <thead>
                        <tr className='text-lg'>
                            <th className='flex items-center space-x-2'>
                                <input type="checkbox" name="" id=""
                                    onClick={(e: any) => handleSelectMultiple(e.target.checked)}
                                />
                                <p>Name</p>
                            </th>
                            <th>Calculation</th>
                            <th>Result</th>
                            {calculationIds.length > 1 && (
                                <th className='element-hover'>
                                    <RiDeleteBin6Fill className='text-xl element-hover'
                                        onClick={() => handleMultipleDelete()}
                                    />
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className='text-gray-700 font-normal'>
                        {history.map((item: HistoryItem, index: number) => (
                            <tr key={index}>
                                <td className='flex items-center space-x-2'
                                    onClick={(e: any) => handleSelection(e, item)}
                                >
                                    <input type="checkbox" name="" id="" checked={calculationIds.includes(item._id)} />
                                    <p>{item.calculationName}</p>
                                </td>
                                <td className=' font-light'>{item.calculationPattern}</td>
                                <td className=' font-light'>{item.result}</td>
                                <td>
                                    <HiOutlineRefresh className='text-xl element-hover'
                                        onClick={() => setResult(item.calculationPattern)}
                                    />
                                </td>
                                {calculationIds.length <= 1 && (
                                    <td>
                                        <RiDeleteBin6Fill className='text-xl element-hover'
                                            onClick={() => handleDelete(item._id)}
                                        />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>
                    <p>No previous calculation available.</p>
                </div>
            )}
        </div>
    )
}

export default History
