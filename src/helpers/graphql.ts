export default async function query(body: JSON) {
    return new Promise<JSON>((resolve, reject) => (
        fetch(`http://${process.env.BACK_END_ENDPOINT}:${process.env.BACK_END_PORT}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body)
        })
            .then(response => (200 <= response.status && response.status > 300)
                ? resolve(response.json())
                : reject(response.json()))
    ))
}
