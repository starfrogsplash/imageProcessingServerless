// @ts-ignore
import lambdaTester from 'lambda-tester';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { download } from '../../../app/handlers/downloadHandler';
import { S3Service } from '../../../app/services/S3Service';

const imageBase64 = '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';

describe('GET: download', () => {
  it('Missing body params returns 400 bad request error', async () => {
    await lambdaTester(download)
      .event({
        httpMethod: 'GET',
        queryStringParameters: {
          name: 'Invalid Param',
        },
      } as unknown as APIGatewayProxyEvent)
      .expectResult((result: any) => expect(result).toEqual({
        body: '{"error":"[\\n  {\\n    \\"code\\": \\"invalid_type\\",\\n    \\"expected\\": \\"string\\",\\n    \\"received\\": \\"undefined\\",\\n    \\"path\\": [\\n      \\"fileName\\"\\n    ],\\n    \\"message\\": \\"Required\\"\\n  }\\n]"}',
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
      }));
  });

  it('Image fails does not exist and returns 404 not found error', async () => {
    jest.spyOn(S3Service.prototype, 'downloadImage').mockRejectedValueOnce(new Error('Image does not exist'));

    await lambdaTester(download)
      .event({
        httpMethod: 'GET',
        queryStringParameters: {
          fileName: 'image1',
        },
      } as unknown as APIGatewayProxyEvent)
      .expectResult((result: any) => {
        console.log('result>>>>.', result);
        expect(result).toEqual({
          body: '{\"error\":\"Image does not exist\"}',
          headers: {
            'Content-Type': 'application/json',
          },
          statusCode: 404,
        });
      });
  });

  it('Image fails to download and returns 500 server error', async () => {
    jest.spyOn(S3Service.prototype, 'downloadImage').mockRejectedValueOnce(new Error('Image failed to download'));

    await lambdaTester(download)
      .event({
        httpMethod: 'GET',
        queryStringParameters: {
          fileName: 'image1',
        },
      } as unknown as APIGatewayProxyEvent)
      .expectResult((result: any) => expect(result).toEqual({
        body: '{\"error\":\"Image failed to download\"}',
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 500,
      }));
  });

  it('file requested with the correct params downloads returns image 200 success', async () => {
    jest.spyOn(S3Service.prototype, 'downloadImage').mockResolvedValueOnce(imageBase64);

    await lambdaTester(download)
      .event({
        httpMethod: 'GET',
        queryStringParameters: {
          fileName: 'image1',
        },
      } as unknown as APIGatewayProxyEvent)
      .expectResult((result: any) => expect(result).toEqual({
        body: imageBase64,
        headers: {
          'Content-Type': 'image/jpeg',
        },
        isBase64Encoded: true,
        statusCode: 200,
      }));
  });
});
