import { gql } from '@apollo/client';

export const GET_PHOTOS = gql`
  query GetPhotos($options: PageQueryOptions) {
    photos(options: $options) {
      data {
        id
        title
        url
        thumbnailUrl
      }
    }
  }
`;

export const GET_PHOTO_DETAILS = gql`
  query GetPhoto($id: ID!) {
    photo(id: $id) {
      id
      title
      url
      thumbnailUrl
      album {
        user {
          name
        }
      }
    }
  }
`;
