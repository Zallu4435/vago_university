export interface ColumnConfig<T> {
    header: string;
    key: keyof T | string;
    render?: (item: T) => React.ReactNode;
    width?: string;
}

export interface ActionConfig<T> {
    icon: React.ReactNode | ((item: T) => React.ReactNode);
    label: string | ((item: T) => string);
    onClick: (item: T) => void;
    color: 'blue' | 'green' | 'red' | 'yellow';
    disabled?: boolean | ((item: T) => boolean);
}

export interface ApplicationsTableProps<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    actions?: ActionConfig<T>[];
    formatDate?: (date: string) => string;
}


interface Filters {
    [key: string]: string | undefined;
}

export interface FilterPanelProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterOpen: boolean;
    setFilterOpen: (open: boolean) => void;
    filters: Filters;
    filterOptions: {
        [key: string]: string[];
    };
    debouncedFilterChange: (field: string, value: string) => void;
    customDateRange?: {
        startDate: string;
        endDate: string;
    };
    handleCustomDateChange?: (field: 'startDate' | 'endDate', value: string) => void;
    handleResetFilters: () => void;
}


interface Stat {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change: string;
    isPositive: boolean;
}

interface Tab {
    label: string;
    icon: React.ReactNode;
    active: boolean;
}

export interface HeaderProps {
    title?: string;
    subtitle?: string;
    stats?: Stat[];
    tabs?: Tab[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchPlaceholder?: string;
    filters?: Filters;
    filterOptions?: {
        [key: string]: string[];
    };
    debouncedFilterChange: (field: string, value: string) => void;
    customDateRange?: {
        startDate: string;
        endDate: string;
    };
    handleCustomDateChange?: (field: 'startDate' | 'endDate', value: string) => void;
    handleResetFilters: () => void;
    onTabClick?: (index: number) => void;
}

export type PaginationProps = {
    page?: number;
    totalPages?: number;
    itemsCount?: number;
    itemName?: string;
    onPageChange?: (newPage: number) => void;
    onFirstPage?: () => void;
    onLastPage?: () => void;
    maxDots?: number;
    showMobileDots?: boolean;
    containerClass?: string;
    buttonClass?: string;
    activeButtonClass?: string;
    disabledButtonClass?: string;
    defaultButtonClass?: string;
};
