import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ListaProdutos from '../src/pages/ListaProdutos';
import api from '../src/services/api';

jest.mock('../src/services/api');

describe('ListaProdutos Screen', () => {
    const mockNavigate = jest.fn();

    const mockProdutos = [
        {
            id: 1,
            name: 'Produto 1',
            price: 'R$ 10,00',
            description: 'Descrição do Produto 1',
            image: 'https://via.placeholder.com/150',
        },
        {
            id: 2,
            name: 'Produto 2',
            price: 'R$ 20,00',
            description: 'Descrição do Produto 2',
            image: 'https://via.placeholder.com/150',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the list of products', async () => {
        jest.spyOn(api, 'get').mockResolvedValueOnce({ data: mockProdutos });

        const { getByText, getAllByText } = render(
            <ListaProdutos navigation={{ navigate: mockNavigate } as any} />
        );

        await waitFor(() => {
            expect(getByText('Lista de Produtos')).toBeTruthy();
            expect(getByText('Produto 1')).toBeTruthy();
            expect(getByText('Produto 2')).toBeTruthy();
            expect(getAllByText('R$ 10,00').length).toBeGreaterThan(0);
        });
    });

    it('should navigate to AvaliaProduto when "Avaliar" button is pressed', async () => {
        jest.spyOn(api, 'get').mockResolvedValueOnce({ data: mockProdutos });

        const { getAllByText } = render(
            <ListaProdutos navigation={{ navigate: mockNavigate } as any} />
        );

        await waitFor(() => {
            const avaliarButtons = getAllByText('Avaliar');
            fireEvent.press(avaliarButtons[0]);
            expect(mockNavigate).toHaveBeenCalledWith('AvaliaProduto', { productId: 1 });
        });
    });

    it('should handle API errors gracefully', async () => {
        jest.spyOn(api, 'get').mockRejectedValueOnce(new Error('Erro ao buscar produtos'));
        jest.spyOn(console, 'error').mockImplementation(() => { });

        const { getByText } = render(
            <ListaProdutos navigation={{ navigate: mockNavigate } as any} />
        );

        await waitFor(() => {
            expect(getByText('Lista de Produtos')).toBeTruthy();
        });

        jest.restoreAllMocks();
    });
});