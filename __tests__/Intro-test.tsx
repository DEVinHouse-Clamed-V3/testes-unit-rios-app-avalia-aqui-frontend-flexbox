import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Intro from '../src/pages/Intro';

describe('Intro Screen', () => {
    const mockNavigate = jest.fn();

    const renderIntro = () => {
        return render(
            <Intro navigation={{ navigate: mockNavigate } as any} />
        );
    };

    it('should render all texts', () => {
        const { getByText } = renderIntro();

        expect(getByText('Avalie Aqui')).toBeTruthy();
        expect(getByText('Escolha um produto que deseja avaliar e compartilhe sua experiência com outros consumidores.')).toBeTruthy();
        expect(getByText('Entrar')).toBeTruthy();
    });

    it('should navigate to ListaProdutos when button Entrar is pressed', () => {
        const { getByText } = renderIntro();

        const button = getByText('Entrar');
        fireEvent.press(button);

        expect(mockNavigate).toHaveBeenCalledWith('ListaProdutos');
    });
});
