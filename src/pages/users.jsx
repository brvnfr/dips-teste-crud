import DataTable from "../components/Tables/DataTable"
import React, { useState, useEffect } from 'react';
import {
    Box,
  } from "@chakra-ui/react";


function Users() {
   
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        fetch('https://sheet.best/api/sheets/09f9b767-7a7c-4612-ac52-f5fc02c8613a')
            .then(response => response.json())
            .then(result => setUserList(result))
            .catch(error => console.error(error));
    }, []);

    return (
        <div class='container'>
            <Box maxW={800} w="100%" h={200} px={1} py={4}>
            <h1>Usuarios do sistema</h1>
            </Box>


            { userList && userList.length
             ?
            <DataTable data={userList} />
            :
            'Carregando'
}
        </div>
    )
}
   


export default Users