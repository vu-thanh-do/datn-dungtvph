import { Box, Button, Paper, Stack, Typography, CircularProgress } from '@mui/material'
import { BiSolidPlusCircle, BiFile, BiTrash } from 'react-icons/bi'
import { IImage } from '../../interfaces/image.type'
import { useDeleteImagesProductMutation, useUploadImagesProductMutation } from '../../api/Product'
import { memo, useEffect, useState } from 'react'
import SKUpload from '../Skeleton/SKUpload'
import { Link } from 'react-router-dom'

interface Props {
  urls: IImage[]
  setUrl: React.Dispatch<React.SetStateAction<IImage[]>>
  setLoadingUpload: React.Dispatch<React.SetStateAction<boolean>>
  setLoadingDelete: React.Dispatch<React.SetStateAction<boolean>>
}

const BoxUpload = ({ urls, setUrl, setLoadingUpload, setLoadingDelete }: Props) => {
  const [lenghtFiles, setLenghtFiles] = useState(0)
  const [id, setId] = useState<string>()
  const [uploadImages, { isLoading }] = useUploadImagesProductMutation()
  const [deleteImages, { isLoading: deleting }] = useDeleteImagesProductMutation()
  const uploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = [] as File[]
    const file = event.target.files as FileList
    setLenghtFiles(file.length)
    if (!file) return
    for (let i = 0; i < file.length; i++) {
      fileList.push(file[i])
    }
    const formData = new FormData()

    fileList.forEach((file: File) => {
      formData.append('images', file)
    })
    uploadImages(formData as any).then(({ data }: any) => {
      setUrl((pre: IImage[]) => [...pre, ...data.urls])
    })
  }

  useEffect(() => {
    setLoadingUpload(isLoading)
    setLoadingDelete(deleting)
  }, [isLoading, deleting])

  return (
    <>
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          margin: '10px 0',
          border: '2px dashed #a1a1aa',
          borderRadius: '5px',
          padding: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography component='h3' sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
          Upload file
        </Typography>
        <Box sx={{ position: 'relative' }}>
          <input
            className='relative max-w-[200px] h-[46px] z-[2] opacity-0 cursor-pointer'
            type='file'
            name='images[]'
            id=''
            formEncType='multipart/form-data'
            multiple
            onChange={uploadHandler}
          />
          <Button
            sx={{
              position: 'absolute',
              backgroundColor: '#0891b2',
              color: 'white',
              display: 'flex',
              gap: '5px',
              margin: '0 auto',
              alignItems: 'center',
              ':hover': {
                backgroundColor: '#06b6d4'
              },
              width: '100%',
              height: '100%',
              inset: 0,
              zIndex: 1
            }}
          >
            <i className='text-[20px]'>
              <BiSolidPlusCircle />
            </i>
            Upload
          </Button>
        </Box>
        <Typography component='p' sx={{ marginTop: '10px' }}>
          JPG,PNG
        </Typography>
      </Paper>
      <Stack gap={2} sx={{ maxHeight: '150px', overflowY: 'auto' }}>
        {urls ? (
          <>
            {urls?.map((image) => (
              <Paper
                elevation={3}
                key={image.publicId}
                sx={{
                  padding: '15px',
                  backgroundColor: '#60a5fa',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ fontSize: '30px' }}>
                  <BiFile />
                </Box>
                <Typography component='p' sx={{ fontSize: '20px' }}>
                  <Link to={image.url as string} target='_blank'>
                    {image.filename}
                  </Link>
                </Typography>
                <Box
                  sx={{ cursor: 'pointer', marginLeft: 'auto' }}
                  onClick={() => {
                    deleteImages(image.publicId)
                      .unwrap()
                      .then(({ data }) => {
                        const filterFile = urls.filter((item) => item.publicId !== data.publicId)
                        setUrl(filterFile)
                      })
                    setId(image.publicId)
                  }}
                >
                  {deleting && id === image.publicId ? (
                    <CircularProgress color='inherit' size={24} />
                  ) : (
                    <Box
                      sx={{
                        fontSize: '30px',
                        cursor: 'pointer',
                        marginLeft: 'auto',
                        color: '#e11d48'
                      }}
                    >
                      <BiTrash />
                    </Box>
                  )}
                </Box>
              </Paper>
            ))}
            {isLoading && <SKUpload files={lenghtFiles} />}
          </>
        ) : (
          isLoading && <SKUpload files={lenghtFiles} />
        )}
      </Stack>
    </>
  )
}

export default memo(BoxUpload)
