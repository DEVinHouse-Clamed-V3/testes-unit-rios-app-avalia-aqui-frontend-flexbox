import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AvaliaProduto from '../src/pages/AvaliaProduto';
import api from '../src/services/api';
import { Alert } from 'react-native';

jest.mock('../src/services/api');

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

describe('AvaliaProduto Screen', () => {
    const mockNavigate = jest.fn();
    const mockRoute = { params: { productId: 1 } };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render all fields correctly', async () => {
        jest.spyOn(api, 'get').mockResolvedValueOnce({ data: { name: 'Produto Teste' } });

        const { getByText, getByPlaceholderText } = render(
            <AvaliaProduto route={mockRoute} navigation={{ goBack: mockNavigate } as any} />
        );

        await waitFor(() => {
            expect(getByText('Avaliar Produto: Produto Teste')).toBeTruthy();
            expect(getByText('Nome:')).toBeTruthy();
            expect(getByText('Email:')).toBeTruthy();
            expect(getByText('Feedback:')).toBeTruthy();
            expect(getByText('Experiência:')).toBeTruthy();
            expect(getByText('Recomenda?')).toBeTruthy();
            expect(getByText('Enviar Feedback')).toBeTruthy();
        });
    });

    it('should validate required fields and show error message', async () => {
        jest.spyOn(api, 'get').mockResolvedValueOnce({ data: { name: 'Produto Teste' } });

        const { getByText } = render(
            <AvaliaProduto route={mockRoute} navigation={{ goBack: mockNavigate } as any} />
        );

        await waitFor(() => {
            fireEvent.press(getByText('Enviar Feedback'));
            expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, preencha todos os campos.');
        });
    });

    it('should submit the form with valid data', async () => {
        jest.spyOn(api, 'get').mockResolvedValueOnce({ data: { name: 'Produto Teste' } });
        const postSpy = jest.spyOn(api, 'post').mockResolvedValueOnce({});

        const { getByText, getAllByDisplayValue } = render(
            <AvaliaProduto route={mockRoute} navigation={{ goBack: mockNavigate } as any} />
        );

        await waitFor(() => {
            const inputs = getAllByDisplayValue('');
            fireEvent.changeText(inputs[0], 'Nome');
            fireEvent.changeText(inputs[1], 'nome@mail.com');
            fireEvent.changeText(inputs[2], 'Ótimo produto!');
            fireEvent.press(getByText('Ótimo'));
            fireEvent.press(getByText('Enviar Feedback'));
        });

        await waitFor(() => {
            expect(postSpy).toHaveBeenCalledWith('/reviews', {
                id: expect.any(Number),
                productId: 1,
                name: 'Nome',
                email: 'nome@mail.com',
                feedback: 'Ótimo produto!',
                experience: 'Ótimo',
                recommend: false,
            });
            expect(mockNavigate).toHaveBeenCalled();
        });
    });

    it('should show error message on API failure', async () => {
        jest.spyOn(api, 'get').mockResolvedValueOnce({ data: { name: 'Produto Teste' } });
        jest.spyOn(api, 'post').mockRejectedValueOnce(new Error('Erro ao enviar feedback'));
        jest.spyOn(console, 'error').mockImplementation(() => { });

        const { getByText, getAllByDisplayValue } = render(
            <AvaliaProduto route={mockRoute} navigation={{ goBack: mockNavigate } as any} />
        );

        await waitFor(() => {
            const inputs = getAllByDisplayValue('');
            fireEvent.changeText(inputs[0], 'Nome');
            fireEvent.changeText(inputs[1], 'nome@mail.com');
            fireEvent.changeText(inputs[2], 'Ótimo produto!');
            fireEvent.press(getByText('Ótimo'));
            fireEvent.press(getByText('Enviar Feedback'));
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Erro ao enviar o feedback.');
        });
    });
});