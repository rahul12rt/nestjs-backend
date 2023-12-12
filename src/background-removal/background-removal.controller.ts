// background-removal/background-removal.controller.ts
import { Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';

@Controller('background-removal')
export class BackgroundRemovalController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file) {
    console.log(file,"----file")
    try {
      if (!file) {
        throw new HttpException(
          { success: false, error: 'Invalid request payload' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const apiKey = 'rNHZHCpcR9wcdhBkq4QAV29v'; // Replace with your actual remove.bg API key
      const apiUrl = 'https://api.remove.bg/v1.0/removebg';

      const formData = new FormData();
      formData.append('size', 'auto');
      formData.append('image_file', file.buffer, { filename: file.originalname });

      // Ensure 'uploads' directory exists inside 'src'
      const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

      const response = await axios.post(
        apiUrl,
        formData,
        {
          responseType: 'arraybuffer',
          headers: {
            ...formData.getHeaders(),
            'X-Api-Key': apiKey,
          },
        },
      );

      if (response.status !== 200) {
        throw new HttpException(
          { success: false, error: `Error: ${response.status} ${response.statusText}` },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }



      // Save the result to a file in the 'uploads' directory
      const outputPath = path.join('uploads', 'no-bg.png').replace(/\\/g, '/')
      console.log(outputPath,"----outputPath")
      const publicUrl = `http://localhost:3000/${outputPath}`; // Adjust the port if needed
      fs.writeFileSync(outputPath, response.data);

      return { success: true, resultUrl: publicUrl };
    } catch (error) {
      console.error('Error removing background:', error);
    }
  }
}
