import { useCallback, useEffect, useRef, useState } from 'react';
import { adminApi, formatDateTime } from '../../services/adminApi';
import type { AdminListing, ListingImage, UserBrief } from '../../services/adminApi';
import {
  Badge,
  Button,
  Checkbox,
  ConfirmDialog,
  Field,
  LoadingBlock,
  Modal,
  Select,
  TextArea,
  TextInput,
} from './ui';
import { LISTING_STATUSES, PROPERTY_TYPES, PROVINCES } from './listingOptions';

const emptyForm = {
  title: '',
  description: '',
  suburb: '',
  province: 'gauteng',
  street_address: '',
  property_type: 'house',
  custom_property_type: '',
  bedrooms: '3',
  bathrooms: '2',
  parking_spaces: '1',
  listing_price: '',
  is_pet_friendly: false,
  has_pool: false,
  is_featured: false,
  is_active: true,
  listing_status: 'approved',
  agent: '',
};

interface Props {
  listingId: string | null; // null = create a new listing
  agents: UserBrief[];
  onClose: () => void;
  onSaved: () => void;
  notify: (message: string, type?: 'success' | 'error') => void;
}

const ListingEditor = ({ listingId, agents, onClose, onSaved, notify }: Props) => {
  const isNew = listingId === null;
  const fileInput = useRef<HTMLInputElement>(null);

  const [listing, setListing] = useState<AdminListing | null>(null);
  const [images, setImages] = useState<ListingImage[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const data = await adminApi.getListing(listingId!);
      setListing(data);
      setImages(data.images ?? []);
      setForm({
        title: data.title ?? '',
        description: data.description ?? '',
        suburb: data.suburb ?? '',
        province: data.province ?? 'gauteng',
        street_address: data.street_address ?? '',
        property_type: data.property_type ?? 'house',
        custom_property_type: data.custom_property_type ?? '',
        bedrooms: String(data.bedrooms ?? 0),
        bathrooms: String(data.bathrooms ?? 0),
        parking_spaces: String(data.parking_spaces ?? 0),
        listing_price: String(data.listing_price ?? ''),
        is_pet_friendly: data.is_pet_friendly,
        has_pool: data.has_pool,
        is_featured: data.is_featured,
        is_active: data.is_active,
        listing_status: data.listing_status ?? 'draft',
        agent: data.agent ?? '',
      });
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not load the listing', 'error');
      onClose();
    } finally {
      setLoading(false);
    }
  }, [isNew, listingId, notify, onClose]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'The action failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  const buildPayload = () => ({
    title: form.title,
    description: form.description,
    suburb: form.suburb,
    province: form.province,
    street_address: form.street_address,
    property_type: form.property_type,
    custom_property_type: form.custom_property_type,
    bedrooms: Number(form.bedrooms) || 0,
    bathrooms: Number(form.bathrooms) || 0,
    parking_spaces: Number(form.parking_spaces) || 0,
    listing_price: form.listing_price,
    is_pet_friendly: form.is_pet_friendly,
    has_pool: form.has_pool,
    is_featured: form.is_featured,
    is_active: form.is_active,
    listing_status: form.listing_status,
    agent: form.agent || null,
  });

  const handleSave = () =>
    run(async () => {
      if (!form.title.trim() || !form.listing_price) {
        notify('A title and a price are required', 'error');
        return;
      }

      if (isNew) {
        const result = await adminApi.createListing(buildPayload());
        const created = result.listing;
        // Upload any images the user queued before saving
        const files = fileInput.current?.files;
        if (files && files.length > 0) {
          await adminApi.uploadListingImages(created.id, Array.from(files));
        }
        notify('Listing created');
        onSaved();
        onClose();
      } else {
        await adminApi.updateListing(listingId!, buildPayload());
        notify('Listing updated');
        onSaved();
        await load();
      }
    });

  const handleUpload = (files: FileList | null) =>
    run(async () => {
      if (!files || files.length === 0 || isNew) return;
      const result = await adminApi.uploadListingImages(listingId!, Array.from(files));
      setImages((current) => [...current, ...result.images]);
      notify(result.message);
      onSaved();
    });

  const handleDeleteImage = (imageId: number) =>
    run(async () => {
      await adminApi.deleteListingImage(listingId!, imageId);
      setImages((current) => current.filter((image) => image.id !== imageId));
      notify('Image removed');
      onSaved();
    });

  const handleSetCover = (imageId: number) =>
    run(async () => {
      await adminApi.setListingCoverImage(listingId!, imageId);
      setImages((current) =>
        current.map((image) => ({ ...image, is_primary: image.id === imageId }))
      );
      notify('Cover image updated');
      onSaved();
    });

  const handleDecision = (action: 'approve' | 'reject') =>
    run(async () => {
      let reason = '';
      if (action === 'reject') {
        reason = window.prompt('Why is this listing being rejected?') ?? '';
        if (!reason.trim()) return;
      }
      const result = await adminApi.decideListing(listingId!, {
        action,
        rejection_reason: reason,
        notify: true,
      });
      notify(result.message);
      onSaved();
      await load();
    });

  const handleDelete = () =>
    run(async () => {
      await adminApi.deleteListing(listingId!);
      notify('Listing deleted');
      setConfirmDelete(false);
      onSaved();
      onClose();
    });

  return (
    <>
      <Modal
        open
        onClose={onClose}
        size="lg"
        title={isNew ? 'New property listing' : form.title || 'Edit listing'}
        subtitle={
          listing
            ? `${listing.status_display} · ${listing.view_count} views · updated ${formatDateTime(
                listing.updated_at
              )}`
            : 'Publish a property straight to the public site'
        }
        footer={
          <>
            {!isNew && (
              <Button variant="ghost" onClick={() => setConfirmDelete(true)} disabled={busy}>
                Delete
              </Button>
            )}
            <div className="flex-1" />
            <Button variant="secondary" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={busy}>
              {busy ? 'Saving…' : isNew ? 'Create listing' : 'Save changes'}
            </Button>
          </>
        }
      >
        {loading ? (
          <LoadingBlock />
        ) : (
          <div className="space-y-6">
            {listing && listing.listing_status === 'pending' && (
              <div className="rounded-xl border border-[#F59E0B]/40 bg-[#F59E0B]/10 p-4 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm font-bold text-[#B45309]">Waiting on your approval</p>
                  <p className="text-xs text-[#B45309]/80">
                    Submitted by {listing.submitted_by_name ?? 'an agency'}{' '}
                    {formatDateTime(listing.submitted_at)}
                  </p>
                </div>
                <Button size="sm" onClick={() => handleDecision('approve')} disabled={busy}>
                  Approve & publish
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDecision('reject')}
                  disabled={busy}
                >
                  Reject
                </Button>
              </div>
            )}

            {listing && listing.rejection_reason && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-bold text-red-800">Rejection reason on record</p>
                <p className="text-sm text-red-700 mt-0.5">{listing.rejection_reason}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Title" className="sm:col-span-2">
                <TextInput
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Sunlit 3-bed family home in Fourways"
                />
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <TextArea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What makes this property worth a viewing?"
                />
              </Field>
              <Field label="Street address">
                <TextInput
                  value={form.street_address}
                  onChange={(e) => setForm({ ...form, street_address: e.target.value })}
                />
              </Field>
              <Field label="Suburb">
                <TextInput
                  value={form.suburb}
                  onChange={(e) => setForm({ ...form, suburb: e.target.value })}
                />
              </Field>
              <Field label="Province">
                <Select
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                >
                  {PROVINCES.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Property type">
                <Select
                  value={form.property_type}
                  onChange={(e) => setForm({ ...form, property_type: e.target.value })}
                >
                  {PROPERTY_TYPES.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
              {form.property_type === 'other' && (
                <Field label="Custom type" className="sm:col-span-2">
                  <TextInput
                    value={form.custom_property_type}
                    onChange={(e) => setForm({ ...form, custom_property_type: e.target.value })}
                  />
                </Field>
              )}
              <Field label="Price (R)">
                <TextInput
                  type="number"
                  step="1000"
                  value={form.listing_price}
                  onChange={(e) => setForm({ ...form, listing_price: e.target.value })}
                  placeholder="1850000"
                />
              </Field>
              <Field label="Assigned agent">
                <Select
                  value={form.agent}
                  onChange={(e) => setForm({ ...form, agent: e.target.value })}
                >
                  <option value="">No agent (platform listing)</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.full_name} — {agent.agency_name ?? 'No agency'}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Bedrooms">
                <TextInput
                  type="number"
                  min="0"
                  value={form.bedrooms}
                  onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                />
              </Field>
              <Field label="Bathrooms">
                <TextInput
                  type="number"
                  min="0"
                  value={form.bathrooms}
                  onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                />
              </Field>
              <Field label="Parking spaces">
                <TextInput
                  type="number"
                  min="0"
                  value={form.parking_spaces}
                  onChange={(e) => setForm({ ...form, parking_spaces: e.target.value })}
                />
              </Field>
              <Field label="Publishing status">
                <Select
                  value={form.listing_status}
                  onChange={(e) => setForm({ ...form, listing_status: e.target.value })}
                >
                  {LISTING_STATUSES.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="flex flex-wrap gap-5 pt-1">
              <Checkbox
                label="Pet friendly"
                checked={form.is_pet_friendly}
                onChange={(v) => setForm({ ...form, is_pet_friendly: v })}
              />
              <Checkbox
                label="Has a pool"
                checked={form.has_pool}
                onChange={(v) => setForm({ ...form, has_pool: v })}
              />
              <Checkbox
                label="Feature on the homepage"
                checked={form.is_featured}
                onChange={(v) => setForm({ ...form, is_featured: v })}
              />
              <Checkbox
                label="Visible on the site"
                checked={form.is_active}
                onChange={(v) => setForm({ ...form, is_active: v })}
              />
            </div>

            {/* Gallery */}
            <div className="pt-5 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-900">Photos</p>
                  <p className="text-xs text-gray-500">
                    {isNew
                      ? 'Pick photos now — they upload once the listing is created.'
                      : 'The cover photo is what shows in search results.'}
                  </p>
                </div>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => !isNew && handleUpload(e.target.files)}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInput.current?.click()}
                  disabled={busy}
                >
                  {isNew ? 'Choose photos' : 'Upload photos'}
                </Button>
              </div>

              {isNew ? (
                <p className="text-sm text-gray-500">
                  Selected photos will be attached automatically after the listing is saved.
                </p>
              ) : images.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No photos yet — listings with photos get far more views.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative group rounded-xl overflow-hidden border border-gray-200"
                    >
                      <img
                        src={image.image_url ?? ''}
                        alt={image.alt_text}
                        className="w-full h-28 object-cover"
                      />
                      {image.is_primary && (
                        <span className="absolute top-2 left-2">
                          <Badge status="approved" label="Cover" />
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
                        {!image.is_primary && (
                          <button
                            onClick={() => handleSetCover(image.id)}
                            className="flex-1 bg-gray-900/80 text-white text-[11px] font-semibold py-1.5 hover:bg-gray-900"
                          >
                            Set cover
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="flex-1 bg-red-600/90 text-white text-[11px] font-semibold py-1.5 hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this listing?"
        message="The listing and its photos are removed permanently. Archive it instead if you only want it off the site."
        confirmLabel="Delete permanently"
        destructive
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
};

export default ListingEditor;
