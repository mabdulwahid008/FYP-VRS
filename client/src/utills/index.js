const PINATA_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MGExZDY2Ni04MDJmLTRhNDItYTlhYy0yM2YxNWUzYjA4NmIiLCJlbWFpbCI6ImFiZHVsd2FoaWRtdWhhbW1hZDY2OEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNTBjZDk2YmRjMDc4ZTI3NzBkNzUiLCJzY29wZWRLZXlTZWNyZXQiOiIyOTFiMDZmYjRiMjgzZGQzOTNjMjE3Y2E0YmFlMzQ5YjVlOWE2MTk4ZGQ2YmE3ZDcyNzI2OTBmY2M5OTk0ZWM4IiwiaWF0IjoxNzAzMjY3MDc1fQ.4M1ZlTptIsBI_VnKNFdh-mK1OX8iAiWDJ6AqU2OZ5M4'

export const uploadToIPFS = async(data) => {
    console.log(data);
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS',{
        method: 'POST',
        headers:{
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${PINATA_API_KEY}`
        },
        body: JSON.stringify(data)
    })

    const res = await response.json()
    if(response.ok){
        return res.IpfsHash;
    }
    else
        console.log(res);
}


export const minifyAddress = (address) => {
    const start = address.substr(0, 6)
    const mid = address.substr(8, 15)
    const end = address.substr(address.length - 4)
    return `${start}...${mid}...${end}`
}