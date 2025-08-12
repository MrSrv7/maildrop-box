import { gql } from '@apollo/client';

export const GET_INBOX = gql`
  query GetInbox($mailbox: String!) {
    inbox(mailbox: $mailbox) {
      id
      subject
      date
      headerfrom
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($mailbox: String!, $id: String!) {
    delete(mailbox: $mailbox, id: $id)
  }
`;

export const GET_MESSAGE = gql`
  query GetMessage($mailbox: String!, $id: String!) {
    message(mailbox: $mailbox, id: $id) {
      id
      subject
      date
      headerfrom
      data
      html
    }
  }
`;

export interface EmailMessage {
  id: string;
  subject: string;
  date: string;
  headerfrom: string;
  data?: string;
  html?: string;
}

export interface InboxData {
  inbox: EmailMessage[];
}

export interface MessageData {
  message: EmailMessage;
}
