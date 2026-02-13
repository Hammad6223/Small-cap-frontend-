export const tableColumns = [
    {
        name: 'Favourite',
        selector: row => row['checkbox'],
        sortable: true,
        center: false,
    },
    
    {
        name: 'Symbol',
        selector: row => row['Symbol'],
        sortable: true,
        center: true,
    },
    {
        name: 'Name',
        selector: row => row['Name'],
        sortable: true,
        center: false,
    },
    {
        name: 'Currency',
        selector: row => row['Currency'],
        sortable: false,
        center: true,
    },
    {
        name: 'Exchange',
        selector: row => row['Exchange'],
        sortable: false,
        center: true,
    },
    {
        name: 'Actions',
        selector: row => row['Action'],
        sortable: false,
        center: true,
    }
];