import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ScaleSelector from '../components/ScaleSelector';
import { SCALES } from '../data/scales';

const mockFilters = { root: '', family: '', count: '' };
const mockProps = {
    label: '1. Skála (Fő skála):',
    colorScheme: 'teal',
    selectedId: SCALES[0].id,
    onScaleChange: vi.fn(),
    filteredScales: SCALES.slice(0, 5),
    filters: mockFilters,
    onFilterChange: vi.fn(),
    availableRoots: ['C', 'D', 'E'],
    availableFamilies: ['Kurd', 'Amara'],
    availableCounts: [8, 9, 10],
};

describe('ScaleSelector', () => {
    test('megjelenik a label', () => {
        render(<ScaleSelector {...mockProps} />);
        expect(screen.getByText(/1\. Skála/i)).toBeInTheDocument();
    });

    test('a select tartalmazza az átadott skálákat', () => {
        render(<ScaleSelector {...mockProps} />);
        mockProps.filteredScales.forEach(scale => {
            expect(screen.getByText(scale.name)).toBeInTheDocument();
        });
    });

    test('megjelennek az alaphang szűrő opciók', () => {
        render(<ScaleSelector {...mockProps} />);
        expect(screen.getByText('C')).toBeInTheDocument();
        expect(screen.getByText('D')).toBeInTheDocument();
    });

    test('megjelennek a hangszám szűrő opciók', () => {
        render(<ScaleSelector {...mockProps} />);
        expect(screen.getByText('9 hangos')).toBeInTheDocument();
    });

    test('isCompare=true esetén megjelenik a "Nincs összehasonlítás" opció', () => {
        render(<ScaleSelector {...mockProps} isCompare={true} selectedId="" />);
        expect(screen.getByText(/Nincs összehasonlítás/i)).toBeInTheDocument();
    });
});
