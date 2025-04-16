const CenterFormFields = ({ form }) => {
  const { register, control, setValue, watch } = form;

  return (
    <div className="space-y-4">
      <input {...register("name")} placeholder="Center name" />
      <input {...register("address")} placeholder="Address" />
      <input {...register("phone")} placeholder="Phone" />
      {/* Dropdowns for regions and majors */}
      {/* File upload handler */}
    </div>
  );
};

export default CenterFormFields;
