import { InstitutionRepository, InstitutionCreateDto, InstitutionUpdateDto } from '../repositories/institution.repository';
import { InstitutionTypeRepository } from '../repositories/institution-type.repository';

export class InstitutionService {
    private institutionRepository: InstitutionRepository;
    private institutionTypeRepository: InstitutionTypeRepository;

    constructor() {
        this.institutionRepository = new InstitutionRepository();
        this.institutionTypeRepository = new InstitutionTypeRepository();
    }

    /**
     * Get all institutions with pagination and filters
     */
    async getAllInstitutions(filters: {
        typeId?: string;
        countryCode?: string;
        isActive?: boolean;
        limit?: number;
        offset?: number;
    }) {
        return this.institutionRepository.findAll(filters);
    }

    /**
     * Get institution by ID
     */
    async getInstitutionById(id: string) {
        return this.institutionRepository.findById(id);
    }

    /**
     * Create a new institution
     */
    async createInstitution(data: InstitutionCreateDto) {
        // Verify institution type exists
        const typeExists = await this.institutionTypeRepository.findById(data.typeId);
        if (!typeExists) {
            throw new Error(`Institution type with ID ${data.typeId} not found`);
        }

        return this.institutionRepository.create(data);
    }

    /**
     * Update an institution
     */
    async updateInstitution(id: string, data: InstitutionUpdateDto) {
        // Check if institution exists
        const institution = await this.institutionRepository.findById(id);
        if (!institution) {
            throw new Error(`Institution with ID ${id} not found`);
        }

        // Verify institution type if it's being updated
        if (data.typeId) {
            const typeExists = await this.institutionTypeRepository.findById(data.typeId);
            if (!typeExists) {
                throw new Error(`Institution type with ID ${data.typeId} not found`);
            }
        }

        return this.institutionRepository.update(id, data);
    }

    /**
     * Delete an institution
     */
    async deleteInstitution(id: string) {
        // Check if institution exists
        const institution = await this.institutionRepository.findById(id);
        if (!institution) {
            throw new Error(`Institution with ID ${id} not found`);
        }

        return this.institutionRepository.delete(id);
    }

    /**
     * Activate or deactivate an institution
     */
    async setInstitutionActiveStatus(id: string, isActive: boolean) {
        // Check if institution exists
        const institution = await this.institutionRepository.findById(id);
        if (!institution) {
            throw new Error(`Institution with ID ${id} not found`);
        }

        return this.institutionRepository.setActiveStatus(id, isActive);
    }
}
