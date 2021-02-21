// @ts-ignore
import lambdaTester from 'lambda-tester';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { downloadByFormat as download } from '../../../app/handlers/downloadByFormatHandler';
import { S3Service } from '../../../app/services/S3Service';

const imageBase64 = 'R0lGODlhPQBEAPeoAJosM//AwO/AwHVYZ/z595kzAP/s7P+goOXMv8+fhw/v739/f+8PD98fH/8mJl+fn/9ZWb8/PzWlwv///6wWGbImAPgTEMImIN9gUFCEm/gDALULDN8PAD6atYdCTX9gUNKlj8wZAKUsAOzZz+UMAOsJAP/Z2ccMDA8PD/95eX5NWvsJCOVNQPtfX/8zM8+QePLl38MGBr8JCP+zs9myn/8GBqwpAP/GxgwJCPny78lzYLgjAJ8vAP9fX/+MjMUcAN8zM/9wcM8ZGcATEL+QePdZWf/29uc/P9cmJu9MTDImIN+/r7+/vz8/P8VNQGNugV8AAF9fX8swMNgTAFlDOICAgPNSUnNWSMQ5MBAQEJE3QPIGAM9AQMqGcG9vb6MhJsEdGM8vLx8fH98AANIWAMuQeL8fABkTEPPQ0OM5OSYdGFl5jo+Pj/+pqcsTE78wMFNGQLYmID4dGPvd3UBAQJmTkP+8vH9QUK+vr8ZWSHpzcJMmILdwcLOGcHRQUHxwcK9PT9DQ0O/v70w5MLypoG8wKOuwsP/g4P/Q0IcwKEswKMl8aJ9fX2xjdOtGRs/Pz+Dg4GImIP8gIH0sKEAwKKmTiKZ8aB/f39Wsl+LFt8dgUE9PT5x5aHBwcP+AgP+WltdgYMyZfyywz78AAAAAAAD///8AAP9mZv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAKgALAAAAAA9AEQAAAj/AFEJHEiwoMGDCBMqXMiwocAbBww4nEhxoYkUpzJGrMixogkfGUNqlNixJEIDB0SqHGmyJSojM1bKZOmyop0gM3Oe2liTISKMOoPy7GnwY9CjIYcSRYm0aVKSLmE6nfq05QycVLPuhDrxBlCtYJUqNAq2bNWEBj6ZXRuyxZyDRtqwnXvkhACDV+euTeJm1Ki7A73qNWtFiF+/gA95Gly2CJLDhwEHMOUAAuOpLYDEgBxZ4GRTlC1fDnpkM+fOqD6DDj1aZpITp0dtGCDhr+fVuCu3zlg49ijaokTZTo27uG7Gjn2P+hI8+PDPERoUB318bWbfAJ5sUNFcuGRTYUqV/3ogfXp1rWlMc6awJjiAAd2fm4ogXjz56aypOoIde4OE5u/F9x199dlXnnGiHZWEYbGpsAEA3QXYnHwEFliKAgswgJ8LPeiUXGwedCAKABACCN+EA1pYIIYaFlcDhytd51sGAJbo3onOpajiihlO92KHGaUXGwWjUBChjSPiWJuOO/LYIm4v1tXfE6J4gCSJEZ7YgRYUNrkji9P55sF/ogxw5ZkSqIDaZBV6aSGYq/lGZplndkckZ98xoICbTcIJGQAZcNmdmUc210hs35nCyJ58fgmIKX5RQGOZowxaZwYA+JaoKQwswGijBV4C6SiTUmpphMspJx9unX4KaimjDv9aaXOEBteBqmuuxgEHoLX6Kqx+yXqqBANsgCtit4FWQAEkrNbpq7HSOmtwag5w57GrmlJBASEU18ADjUYb3ADTinIttsgSB1oJFfA63bduimuqKB1keqwUhoCSK374wbujvOSu4QG6UvxBRydcpKsav++Ca6G8A6Pr1x2kVMyHwsVxUALDq/krnrhPSOzXG1lUTIoffqGR7Goi2MAxbv6O2kEG56I7CSlRsEFKFVyovDJoIRTg7sugNRDGqCJzJgcKE0ywc0ELm6KBCCJo8DIPFeCWNGcyqNFE06ToAfV0HBRgxsvLThHn1oddQMrXj5DyAQgjEHSAJMWZwS3HPxT/QMbabI/iBCliMLEJKX2EEkomBAUCxRi42VDADxyTYDVogV+wSChqmKxEKCDAYFDFj4OmwbY7bDGdBhtrnTQYOigeChUmc1K3QTnAUfEgGFgAWt88hKA6aCRIXhxnQ1yg3BCayK44EWdkUQcBByEQChFXfCB776aQsG0BIlQgQgE8qO26X1h8cEUep8ngRBnOy74E9QgRgEAC8SvOfQkh7FDBDmS43PmGoIiKUUEGkMEC/PJHgxw0xH74yx/3XnaYRJgMB8obxQW6kL9QYEJ0FIFgByfIL7/IQAlvQwEpnAC7DtLNJCKUoO/w45c44GwCXiAFB/OXAATQryUxdN4LfFiwgjCNYg+kYMIEFkCKDs6PKAIJouyGWMS1FSKJOMRB/BoIxYJIUXFUxNwoIkEKPAgCBZSQHQ1A2EWDfDEUVLyADj5AChSIQW6gu10bE/JG2VnCZGfo4R4d0sdQoBAHhPjhIB94v/wRoRKQWGRHgrhGSQJxCS+0pCZbEhAAOw==';

describe('GET: download', () => {
  it('Missing body params returns 400 bad request error', async () => {
    await lambdaTester(download)
      .event({
        httpMethod: 'GET',
        queryStringParameters: {
          name: 'Invalid Param',
          ext: 'tiff',
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
          ext: 'tiff',
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
          ext: 'tiff',
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

  it('file requested with invalid extension throws 400 bad request error', async () => {
    jest.spyOn(S3Service.prototype, 'downloadImage').mockResolvedValueOnce(Buffer.from(imageBase64, 'base64'));

    await lambdaTester(download)
      .event({
        httpMethod: 'GET',
        queryStringParameters: {
          fileName: 'image1',
          ext: 'invalid',
        },
      } as unknown as APIGatewayProxyEvent)
      .expectResult((result: any) => expect(result).toEqual({
        body: '{\"error\":\"[\\n  {\\n    \\\"code\\\": \\\"invalid_enum_value\\\",\\n    \\\"options\\\": [\\n      \\\"png\\\",\\n      \\\"jpeg\\\",\\n      \\\"tiff\\\"\\n    ],\\n    \\\"path\\\": [\\n      \\\"ext\\\"\\n    ],\\n    \\\"message\\\": \\\"Input must be one of these values: png, jpeg, tiff\\\"\\n  }\\n]\"}',
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
      }));
  });

  it('file requested with the extension converted returns image with 200 success', async () => {
    jest.spyOn(S3Service.prototype, 'downloadImage').mockResolvedValueOnce(Buffer.from(imageBase64, 'base64'));

    const imageBase64Tiff = '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';

    await lambdaTester(download)
      .event({
        httpMethod: 'GET',
        queryStringParameters: {
          fileName: 'image1',
          ext: 'tiff',
        },
      } as unknown as APIGatewayProxyEvent)
      .expectResult((result: any) => expect(result).toEqual({
        body: imageBase64Tiff,
        headers: {
          'Content-Type': 'image/tiff',
        },
        isBase64Encoded: true,
        statusCode: 200,
      }));
  });
});
