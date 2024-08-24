let cloud = "dkz1kjotp"
const url = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`

const uploadFile = async(file)=>{
    console.log(url)
    console.log(file)
    const formData = new FormData()
    formData.append('file',file)
    formData.append("upload_preset","kqxmnmum") 

    const response = await fetch(url,{
        method : 'POST',
        body : formData
    })
    const responseData = await response.json()
    console.log(responseData)
    return responseData
}

export default uploadFile