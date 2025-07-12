import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Course from '../../pages/admin/course/course';
import * as courseStore from '../../zustand/courseStore';
import * as authStore from '../../zustand/authStore';
import * as categoryStore from '../../zustand/categoryStore';
import * as instructorStore from '../../zustand/instructorStore';
import * as confirmationModalStore from '../../zustand/confirmationModalStore';
import { BrowserRouter } from 'react-router-dom';

// Mock zustand stores
jest.mock('../../zustand/courseStore');
jest.mock('../../zustand/authStore');
jest.mock('../../zustand/categoryStore');
jest.mock('../../zustand/instructorStore');
jest.mock('../../zustand/confirmationModalStore');
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// Mock child components to simplify test
jest.mock('../../components/table/reactTable', () => (props) => (
  <div>
    <select
      aria-label="page-size"
      value={props.pagination.perPage}
      onChange={(e) => props.onPageSizeChange(Number(e.target.value))}
      data-testid="page-size-select"
    >
      <option value={10}>Show 10</option>
      <option value={20}>Show 20</option>
      <option value={50}>Show 50</option>
    </select>
    <div>ReactTableMock</div>
  </div>
));
jest.mock('../../components/table/tableFilter.jsx', () => () => <div>TableFilterMock</div>);
jest.mock('../../template/templateAdmin', () => (props) => <div>{props.children}</div>);
jest.mock('../../components/button/button', () => (props) => (
  <button {...props}>{props.children}</button>
));
jest.mock('../../components/icons/icon', () => () => <span>IconMock</span>);

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('Course page', () => {
  beforeEach(() => {
    courseStore.default.mockReturnValue({
      courses: [],
      fetchCourses: jest.fn(),
      pagination: { currentPage: 1, lastPage: 1, perPage: 10 },
      sortBy: 'title',
      sortOrder: 'asc',
      perPage: 10,
      error: null,
      loading: false,
      deleteCourse: jest.fn(),
      updateCourseDetail: jest.fn(),
    });
    authStore.default.mockReturnValue({ token: 'dummy-token' });
    categoryStore.default.mockReturnValue({
      categories: [],
      fetchCategoryOptions: jest.fn(),
    });
    instructorStore.default.mockReturnValue({
      instructorSelectOptions: [],
      fetchInstructoryOptions: jest.fn(),
    });
    confirmationModalStore.default.mockReturnValue({
      openModal: jest.fn(),
      closeModal: jest.fn(),
    });
  });

  it('renders without crashing and shows table', () => {
    renderWithRouter(<Course />);
    expect(screen.getByText(/Daftar Kursus/i)).toBeInTheDocument();
    expect(screen.getByText(/ReactTableMock/)).toBeInTheDocument();
    expect(screen.getByText(/TableFilterMock/)).toBeInTheDocument();
  });

  it('calls fetchCourses with correct perPage when page size changes', async () => {
    const fetchCoursesMock = jest.fn();
    courseStore.default.mockReturnValue({
      ...courseStore.default(),
      fetchCourses: fetchCoursesMock,
      perPage: 10,
      pagination: { currentPage: 1, lastPage: 1, perPage: 10 },
    });

    renderWithRouter(<Course />);

    const pageSizeSelect = screen.getByTestId('page-size-select');
    fireEvent.change(pageSizeSelect, { target: { value: '20' } });

    await waitFor(() => {
      expect(fetchCoursesMock).toHaveBeenCalledWith(expect.objectContaining({ perPage: 20 }));
    });
  });

  it('shows error message if error exists', () => {
    courseStore.default.mockReturnValue({
      ...courseStore.default(),
      error: 'Some error',
      loading: false,
    });
    renderWithRouter(<Course />);
    expect(screen.getByText(/Some error/)).toBeInTheDocument();
  });

  it('shows loading message if loading', () => {
    courseStore.default.mockReturnValue({
      ...courseStore.default(),
      loading: true,
      error: null,
    });
    renderWithRouter(<Course />);
    expect(screen.getByText(/Loading.../)).toBeInTheDocument();
  });

  it('shows login message if not logged in', () => {
    authStore.default.mockReturnValue({ token: null });
    renderWithRouter(<Course />);
    expect(screen.getByText(/Anda belum login/)).toBeInTheDocument();
  });
});
