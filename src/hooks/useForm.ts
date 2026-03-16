import { useCallback, useRef, useState } from "react";
import type { FormEvent } from "react";
import type {
  FieldValues,
  RegisterReturn,
  UseFormReturn,
  ValidationRules,
} from "../types/app";

/* ══════════════════════════════════════════════════════════
   useForm HOOK
══════════════════════════════════════════════════════════ */
export function useForm<T extends FieldValues>(
  defaultValues: T,
  rules: ValidationRules<T> = {}
): UseFormReturn<T> {
  const [values, setValues] = useState<T>({ ...defaultValues });
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const rulesRef = useRef<ValidationRules<T>>(rules);
  rulesRef.current = rules;

  const validateField = useCallback((name: keyof T, value: unknown, currentValues: T): string => {
    const r = rulesRef.current[name];
    if (!r) return "";
    const v = value != null ? String(value) : "";

    if (r.required && (!v || v.trim() === "")) {
      return typeof r.required === "string" ? r.required : `${String(name)} is required`;
    }

    if (r.minLength && v.length < r.minLength.value) {
      return r.minLength.message ?? `Minimum ${r.minLength.value} characters`;
    }

    if (r.maxLength && v.length > r.maxLength.value) {
      return r.maxLength.message ?? `Maximum ${r.maxLength.value} characters`;
    }

    if (r.pattern && !r.pattern.value.test(v)) {
      return r.pattern.message ?? "Invalid format";
    }

    if (r.validate) {
      const res = r.validate(v, currentValues);
      if (res !== true) return res || "Invalid";
    }

    return "";
  }, []);

  const register = (name: keyof T): RegisterReturn => ({
    name: String(name),
    value: values[name] ?? "",
    onChange: (e) => {
      const val =
        e.target instanceof HTMLInputElement && e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value;

      setValues((prev) => {
        const next = { ...prev, [name]: val } as T;
        if (touched[name]) setErrors((err) => ({ ...err, [name]: validateField(name, val, next) }));
        return next;
      });
    },
    onBlur: () => {
      setTouched((t) => ({ ...t, [name]: true }));
      setErrors((err) => ({ ...err, [name]: validateField(name, values[name] ?? "", values) }));
    },
  });

  const handleSubmit = (onSubmit: (data: T) => void | Promise<void>) => (e?: FormEvent): void => {
    e?.preventDefault();

    const allTouched = (Object.keys(rulesRef.current) as (keyof T)[]).reduce(
      (a, k) => ({ ...a, [k]: true }),
      {} as Record<keyof T, boolean>
    );
    setTouched(allTouched);

    const newErrors: Partial<Record<keyof T, string>> = {};
    let valid = true;

    (Object.keys(rulesRef.current) as (keyof T)[]).forEach((name) => {
      const err = validateField(name, values[name] ?? "", values);
      newErrors[name] = err;
      if (err) valid = false;
    });

    setErrors(newErrors);
    if (!valid) return;

    setIsSubmitting(true);
    Promise.resolve(onSubmit({ ...values })).finally(() => setIsSubmitting(false));
  };

  const reset = (next?: Partial<T>): void => {
    setValues(next ? ({ ...defaultValues, ...next } as T) : { ...defaultValues });
    setErrors({});
    setTouched({});
  };

  const setFieldValue = (name: keyof T, value: string): void => {
    setValues((prev) => {
      const next = { ...prev, [name]: value } as T;
      if (touched[name]) setErrors((err) => ({ ...err, [name]: validateField(name, value, next) }));
      return next;
    });
  };

  return { register, handleSubmit, errors, values, reset, isSubmitting, setFieldValue };
}
