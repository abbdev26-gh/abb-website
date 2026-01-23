
const token = '1d783e096b05e2d74b6afa8ecbe3bc8d87b9d5f424dc6771958541f1a3dcd3882f7376962b4d128bd9c4d56911c07253d92e931442cab22dc0ab422581c78c543b0457f4d005017cb18f1a983be672abcb4b5bbf4b412c3514547855a523af3e9f4b623187a7c7db433e9ac0c79ab4c728d7b5cf7a44925d0cc445d9c9fcc8ec';
const url = 'http://localhost:1337/api/about-page?populate[values][populate]=*';

async function getData() {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const json = await response.json();
        console.log(JSON.stringify(json, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

getData();
