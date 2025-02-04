const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`

const uploadFile = async(file)=>{
    const formData = new FormData()
    formData.append('file',file)
    formData.append("upload_preset","kqxmnmum") 

    const response = await fetch(url,{
        method : 'POST',
        body : formData
    })
    const responseData = await response.json()
    return responseData
}

export default uploadFile
