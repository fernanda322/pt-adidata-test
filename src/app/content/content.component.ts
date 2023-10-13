import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  items: any[] = [];
  pagedItems: any[] = []; // Items yang ditampilkan dalam satu halaman
  currentPage: number = 1; // Halaman saat ini
  itemsPerPage: number = 10; // Jumlah item per halaman
  itemForm: FormGroup;

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.initializePage(); // Perbarui pagedItems saat navigasi ke halaman sebelumnya
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.items.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.initializePage(); // Perbarui pagedItems saat navigasi ke halaman berikutnya
    }
  }

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.apiService.getItems().subscribe(data => {
      this.items = data;
      this.initializePage();
    });
  }
  initializePage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedItems = this.items.slice(startIndex, endIndex);
  }
  editItem(item: any) {
    const updatedItem = {
      id: item.id,
      name: item.title,
      body: item.body
    };
    this.apiService.updateItem(item.id, updatedItem).subscribe(() => {
      this.getItems(); // Perbarui daftar setelah mengedit
    });
  }

  deleteItem(itemId: number) {
    this.apiService.deleteItem(itemId).subscribe(() => {
      this.getItems(); // Perbarui daftar setelah menghapus
    });
  }

  submitItem() {
    const newItem = this.itemForm.value;
    
    
    this.apiService.createItem(newItem).subscribe(() => {
      this.getItems(); // Perbarui daftar setelah menambahkan
      this.itemForm.reset();
    });
  }
}
