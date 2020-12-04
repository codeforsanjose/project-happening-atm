import React from 'react'
import { render } from '@testing-library/react'
import MeetingView from '../components/MeetingView/MeetingView'

test('renders learn react link', () => {
  const { getByText } = render(<MeetingView />)
  const linkElement = getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
