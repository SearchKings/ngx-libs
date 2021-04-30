import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlainObject } from 'lodash';
import { parse, stringify } from 'qs';

import { deepFilter } from './utils';

@Injectable({
  providedIn: 'root'
})
export class UrlFormSyncService {
  constructor(private router: Router) {}

  create(
    formGroup: FormGroup,
    activatedRoute: ActivatedRoute,
    destroySubject$: Subject<any> = new Subject<void>()
  ): UrlFormSyncer {
    return new UrlFormSyncer(
      formGroup,
      activatedRoute,
      this.router,
      destroySubject$
    );
  }
}

export class UrlFormSyncer {
  private formValuesSource$: ReplaySubject<{
    [key: string]: any;
  }> = new ReplaySubject();
  private initialized: boolean = false;
  public formValues$ = this.formValuesSource$.asObservable();

  constructor(
    private formGroup: FormGroup,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private onDestroy$
  ) {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(values => {
        let filters = deepFilter(
          values,
          value => value !== null && value !== undefined && value !== ''
        );
        filters = deepFilter(filters, value => {
          if (isPlainObject(value)) {
            return !!Object.keys(value).length;
          }

          if (Array.isArray(value)) {
            return !!value.length;
          }

          return true;
        });

        this.formValuesSource$.next(filters);

        this.router.navigateByUrl(
          `${window.location.pathname}?${stringify(filters)}`
        );
      });

    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        const params = parse(window.location.search.slice(1), {
          ignoreQueryPrefix: true
        });

        this.formGroup.patchValue(params, {
          emitEvent: !this.initialized
        });

        this.initialized = true;
      });
  }

  destroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
