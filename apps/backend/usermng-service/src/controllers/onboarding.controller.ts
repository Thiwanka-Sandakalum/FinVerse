import { Request, Response } from 'express';
import { createOrganization } from '../services/organization.service';
import { assignOrganizationMemberRoles } from '../services/member.service';
import { updateUser } from '../services/user.service';
import { getRoles } from '../services/role.service';
import { getOrganizations } from '../services/organization.service';
import { addUserToOrganization, assignUserToRole } from '../models/user.model';

export const onboardOrganization = async (req: Request, res: Response) => {
    try {
        // 1. Validate input
        const userId = req.header('x-user-id');
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ success: false, message: 'Missing or invalid userId in header' });
        }
        const { companyName, metadata } = req.body;
        if (!companyName || typeof companyName !== 'string') {
            return res.status(400).json({ success: false, message: 'Missing or invalid companyName in body' });
        }

        // 2. Create or fetch organization
        let org;
        try {
            org = await createOrganization({ name: companyName, metadata });
        } catch (err: any) {
            if (err?.errorCode === 'Conflict' || err?.statusCode === 409 || /already exists/i.test(err?.message)) {
                if (companyName.length > 0 && companyName.length <= 255) {
                    try {
                        const orgs = await getOrganizations();
                        org = orgs?.items?.find((o: any) => o.name === companyName || o.display_name === companyName);
                        if (!org) {
                            return res.status(409).json({ success: false, message: 'Organization exists but could not be found by name.' });
                        }
                    } catch (queryErr: any) {
                        return res.status(409).json({ success: false, message: 'Organization exists but lookup failed: ' + (queryErr?.message || queryErr) });
                    }
                } else {
                    return res.status(409).json({ success: false, message: 'Organization exists but companyName is invalid for lookup.' });
                }
            } else {
                return res.status(400).json({ success: false, message: err?.message || 'Error creating organization.' });
            }
        }

        // 3. Assign user to organization
        await addUserToOrganization(org.id, userId);

        // 4. Assign org_admin role to user (with fallback)
        let orgAdminRoleId = 'rol_lwCVSXrdSoyEIviL';
        try {
            await assignOrganizationMemberRoles(org.id, userId, [orgAdminRoleId]);
            await assignUserToRole(orgAdminRoleId, userId);
        } catch (err: any) {
            if (/role-id/.test(err?.message) || /validation/i.test(err?.message)) {
                const roles = await getRoles({});
                const found = roles?.items?.find((r: any) => r.name === 'org_admin' || r.name === 'Organization Admin');
                if (found) {
                    await assignOrganizationMemberRoles(org.id, userId, [found.id]);
                } else {
                    throw err;
                }
            } else {
                throw err;
            }
        }

        // 5. Update user metadata
        await updateUser(userId, {
            metadata: {
                onboarding_stage: 'completed',
                org_id: org.id,
            }
        });

        return res.status(200).json({ success: true, orgId: org.id, userId });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error?.message || 'Onboarding failed' });
    }
};
