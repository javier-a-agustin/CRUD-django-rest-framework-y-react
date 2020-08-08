
export const getTasks = async() => {
    const url = 
}


export const getGifs = async( category ) => {
    const apiKey = "tsnbn3qAimgIOewixSwW30p1z76i1ukw";
    const url = `https://api.giphy.com/v1/gifs/search?q=${ encodeURI(category)}&limit=10&api_key=${apiKey}`
    
    const resp = await fetch(url);
    const {data} = await resp.json();

    const gifs = data.map( img => {
        return {
            'id': img.id,
            'title': img.title,
            'url': img.images?.downsized_medium.url
        };
    });

    return gifs;

};